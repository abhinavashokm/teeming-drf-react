import asyncio
import json
import logging
import time
from asgiref.sync import sync_to_async
from apps.workspace import workspace_services
from channels.generic.websocket import AsyncWebsocketConsumer

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

    async def send_notification(self, event):
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
