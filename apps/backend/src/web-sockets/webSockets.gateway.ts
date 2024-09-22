import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatDTO } from '../chat/dto/chat.dto';

export const EVENTS_NAMES = {
    CHAT_CREATED: 'chatCreated',
    CHAT_DELETED: 'chatDeleted'
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
        console.log(`${client.handshake.auth.userId}`);
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

    // TODO: CREATE MESSAGE

    // TODO: DELETE MESSAGE
}
