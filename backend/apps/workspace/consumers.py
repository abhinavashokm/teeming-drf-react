import asyncio
import json
import logging
import time
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from apps.workspace import workspace_services
from channels.generic.websocket import AsyncWebsocketConsumer

from apps.goal.models import Goal
from apps.discussion.models import DiscussionMessage
from core.services import s3_service

logger = logging.getLogger("websocket")

PING_TIMEOUT = 60  # if no ping received in 60s, consider client dead
CHECK_INTERVAL = 15  # how often to check


class WorkspaceConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return

        self.workspace = self.scope.get("workspace")

        # per-user group - for notification
        self.group_name = f"notifications_user_{self.user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # workspace-wide presence group
        self.presence_group = f"presence_workspace_{self.workspace.slug}"
        await self.channel_layer.group_add(self.presence_group, self.channel_name)

        # only one goal-discussion room can be active at a time
        self.current_discussion = None

        await self.accept()

        self.last_ping_at = time.monotonic()
        self._watchdog_task = asyncio.ensure_future(self.ping_watchdog())

        # add live presence to redis
        await sync_to_async(workspace_services.add_online_user)(
            workspace_slug=self.workspace.slug,
            user_id=self.user.id
        )

        logger.info(
            f": Workspace WS connected: user={self.user.full_name}-{self.user.email}"
        )

        # tell everyone else in the workspace this user is online
        await self.channel_layer.group_send(
            self.presence_group,
            {
                "type": "presence_update",
                "user_id": str(self.user.id),
                "status": "online",
            },
        )

    async def ping_watchdog(self):
        """Periodically check if the client has gone silent, and force-close if so."""
        try:
            while True:
                await asyncio.sleep(CHECK_INTERVAL)
                idle_time = time.monotonic() - self.last_ping_at
                if idle_time > PING_TIMEOUT:
                    logger.warning(
                        f"No ping from user={self.user.id} in {idle_time:.0f}s, "
                        f"closing stale connection"
                    )
                    await self.close(code=4008)  # heartbeat timeout
                    break
        except asyncio.CancelledError:
            pass  # normal shutdown, nothing to do

    async def disconnect(self, close_code):

        if hasattr(self, "_watchdog_task"):
            self._watchdog_task.cancel()

        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

        # leave the active goal-discussion group, if any
        if getattr(self, "current_discussion", None):
            await self.channel_layer.group_discard(
                f"goal_discussion_{self.current_discussion}", self.channel_name
            )

        if hasattr(self, "presence_group"):
            await self.channel_layer.group_discard(
                self.presence_group, self.channel_name
            )

            # remove live presence from redis
            await sync_to_async(workspace_services.remove_online_user)(
                workspace_slug=self.workspace.slug,
                user_id=self.user.id
            )

            await self.channel_layer.group_send(
                self.presence_group,
                {
                    "type": "presence_update",
                    "user_id": str(self.user.id),
                    "status": "offline",
                },
            )
            logger.info(
                f": Workspace WS disconnected: user={self.user.full_name}-{self.user.email}"
            )

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data)
        except (TypeError, json.JSONDecodeError):
            logger.warning(f"Invalid WS payload from user={self.user.id}: {text_data}")
            return

        message_type = data.get("type")

        if message_type == "ping":
            self.last_ping_at = time.monotonic()  # record that client is alive
            await self.send(text_data=json.dumps({"type": "pong"}))
            return

        if message_type == "join_discussion":
            await self._handle_join_discussion(data)
            return

        if message_type == "leave_discussion":
            await self._handle_leave_discussion(data)
            return

        if message_type == "chat_message":
            await self._handle_chat_message(data)
            return

        logger.warning(f"Unknown WS message type from user={self.user.id}: {message_type}")

    async def notification_update(self, event):
        await self.send(text_data=json.dumps(event))

    # matches "type": "presence_update" sent via group_send
    async def presence_update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "presence_update",
                    "userId": event["user_id"],
                    "status": event["status"],
                }
            )
        )

    # matches "type": "discussion_message" sent via group_send
    async def discussion_message(self, event):
        await self.send(text_data=json.dumps(event))

    # ---- goal discussion handlers ----

    async def _handle_join_discussion(self, data):
        goal_id = data.get("goal_id")
        if not goal_id:
            return

        # already in this discussion — no-op
        if goal_id == self.current_discussion:
            return

        if not await self.goal_belongs_to_workspace(goal_id):
            logger.warning(
                f"Rejected join_discussion: user={self.user.id} goal={goal_id} "
                f"not in workspace={self.workspace.slug}"
            )
            await self.send(text_data=json.dumps({
                "type": "discussion_error",
                "goal_id": goal_id,
                "error": "not_found_or_forbidden",
            }))
            return

        # leave the previous discussion, if switching
        if self.current_discussion:
            await self.channel_layer.group_discard(
                f"goal_discussion_{self.current_discussion}", self.channel_name
            )

        await self.channel_layer.group_add(f"goal_discussion_{goal_id}", self.channel_name)
        self.current_discussion = goal_id

    async def _handle_leave_discussion(self, data):
        goal_id = data.get("goal_id")
        # only allow leaving the room you're actually in
        if not goal_id or goal_id != self.current_discussion:
            return

        await self.channel_layer.group_discard(f"goal_discussion_{goal_id}", self.channel_name)
        self.current_discussion = None

    async def _handle_chat_message(self, data):
        goal_id = data.get("goal_id")
        content = (data.get("content") or "").strip()

        if not content or not goal_id:
            return

        # guard: only allow sending into the room this connection is currently in
        if goal_id != self.current_discussion:
            logger.warning(
                f"Rejected chat_message: user={self.user.id} not joined to goal={goal_id}"
            )
            return

        message = await self.save_message(goal_id, content)

        await self.channel_layer.group_send(
            f"goal_discussion_{goal_id}",
            {
                "type": "discussion_message",
                "goal_id": goal_id,
                "id": str(message.id),
                "content": message.content,
                "sender": {
                    "id": str(message.sender.id),
                    "fullName": message.sender.full_name,
                    "email": message.sender.email,
                    "avatarUrl": s3_service.build_s3_url(message.sender.avatar_thumb_key),
                },
                "createdAt": message.created_at.isoformat(),
            },
        )

    # ---- db helpers ----

    @database_sync_to_async
    def goal_belongs_to_workspace(self, goal_id):
        return Goal.objects.filter(id=goal_id, workspace=self.workspace).exists()

    @database_sync_to_async
    def save_message(self, goal_id, content):
        message = DiscussionMessage.objects.create(
            goal_id=goal_id,
            workspace=self.workspace,
            sender=self.user,
            content=content,
        )
        # Re-fetch with sender to avoid lazy load issues in async context
        return DiscussionMessage.objects.select_related("sender").get(id=message.id)