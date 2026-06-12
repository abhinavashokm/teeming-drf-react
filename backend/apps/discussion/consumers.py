import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from apps.goal.models import Goal
from apps.discussion.models import DiscussionMessage


class DiscussionConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.workspace = self.scope.get("workspace")
        self.goal_id = self.scope["url_route"]["kwargs"]["goal_id"]

        if not self.workspace:
            print("❌ Rejected: no workspace")
            await self.close()
            return

        if not await self.goal_belongs_to_workspace():
            print("❌ Rejected: goal doesn't belong to workspace")
            await self.close()
            return
        
        print("joined discussion: ", self.scope.get('user').full_name)

        self.room_group_name = f"goal_discussion_{self.goal_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        content = data.get("content", "").strip()

        if not content:
            return

        message = await self.save_message(content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "discussion_message",
                "id": str(message.id),
                "content": message.content,
                "sender": {
                    "id": str(message.sender.id),
                    "fullName": message.sender.full_name,
                    "email": message.sender.email
                },
                "createdAt": message.created_at.isoformat(),
            },
        )

    async def discussion_message(self, event):

        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def goal_belongs_to_workspace(self):
        return Goal.objects.filter(
            id=self.goal_id,
            workspace=self.workspace
        ).exists()
    
    @database_sync_to_async
    def save_message(self, content):
        message = DiscussionMessage.objects.create(
            goal_id=self.goal_id,
            workspace=self.workspace,
            sender=self.scope['user'],
            content=content,
        )
        # Re-fetch with sender to avoid lazy load issues in async context
        return DiscussionMessage.objects.select_related('sender').get(id=message.id)
