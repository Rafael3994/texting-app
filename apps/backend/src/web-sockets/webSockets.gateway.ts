import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatDTO } from '../chat/dto/chat.dto';
import { TextDTO } from '@src/text/dto/text.dto';
import { TextEntity } from '@src/text/entity/text.entity';
import { TextPublicDTO } from '@src/text/dto/text.public.dto';
import { ChatEntity } from '@src/chat/entity/chat.entity';

export const EVENTS_NAMES = {
    CHAT_CREATED: 'chatCreated',
    CHAT_DELETED: 'chatDeleted',
    MESSAGE_CREATED: 'messageCreated',
    MESSAGE_DELETED: 'messageDeleted',
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WebSocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        client.join(`user_${client.handshake.auth.userId}`);
    }

    handleDisconnect(client: Socket) { }

    @SubscribeMessage(EVENTS_NAMES.CHAT_CREATED)
    handleCreateChat(chatData: ChatDTO): void {
        const { userId1, userId2 } = chatData;
        this.server.to(`user_${userId1}`).emit(EVENTS_NAMES.CHAT_CREATED, chatData);
        this.server.to(`user_${userId2}`).emit(EVENTS_NAMES.CHAT_CREATED, chatData);
    }

    @SubscribeMessage(EVENTS_NAMES.CHAT_DELETED)
    handleDeleteChat(chatData: ChatDTO): void {
        const { userId1, userId2 } = chatData;
        this.server.to(`user_${userId1}`).emit(EVENTS_NAMES.CHAT_DELETED, chatData);
        this.server.to(`user_${userId2}`).emit(EVENTS_NAMES.CHAT_DELETED, chatData);
    }

    @SubscribeMessage(EVENTS_NAMES.MESSAGE_CREATED)
    handleCreateMessage(chatData: ChatEntity, messagesData: TextPublicDTO): void {
        const { userId1, userId2 } = chatData;
        this.server.to(`user_${userId1}`).emit(EVENTS_NAMES.MESSAGE_CREATED, messagesData);
        this.server.to(`user_${userId2}`).emit(EVENTS_NAMES.MESSAGE_CREATED, messagesData);
    }

    // TODO: DELETE MESSAGE
}
