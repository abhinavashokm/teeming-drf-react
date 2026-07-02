import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger("websocket")


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

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

        if hasattr(self, "presence_group"):
            await self.channel_layer.group_discard(
                self.presence_group, self.channel_name
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
