import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging


logger = logger = logging.getLogger('websocket')


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return

        # Each user gets their own group channel
        self.group_name = f"notifications_user_{self.user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        logger.info(f":Noficiation WS connected: user={self.user.full_name}-{self.user.email}")

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            logger.info(f":Noficiation WS disconnected: user={self.user.full_name}-{self.user.email}")

    # Called when a message is pushed to this user's group
    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event))
