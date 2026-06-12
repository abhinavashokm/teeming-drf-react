import json
from channels.generic.websocket import AsyncWebsocketConsumer


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
        print("connect!!!!!!!!!!!!")

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Called when a message is pushed to this user's group
    async def send_notification(self, event):
        print("sentt!!!!!!!!!!!!!!!!!!!!!!!")
        await self.send(text_data=json.dumps(event))
