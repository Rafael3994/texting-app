import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatDTO } from '../chat/dto/chat.dto';

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

    @SubscribeMessage('createChat')
    handleCreateChat(chatData: ChatDTO): void {
        const { userId1, userId2 } = chatData;
        this.server.to(`user_${userId1}`).emit('chatCreated', chatData);
        this.server.to(`user_${userId2}`).emit('chatCreated', chatData);
    }

    // TODO: DELETE CHAT

    // TODO: CREATE MESSAGE

    // TODO: DELETE MESSAGE
}
