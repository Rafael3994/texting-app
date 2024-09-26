import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatDTO } from '../chat/dto/chat.dto';
import { TextPublicDTO } from '@src/text/dto/text.public.dto';
import { ChatEntity } from '@src/chat/entity/chat.entity';
export declare const EVENTS_NAMES: {
    CHAT_CREATED: string;
    CHAT_DELETED: string;
    MESSAGE_CREATED: string;
    MESSAGE_DELETED: string;
};
export declare class WebSocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleCreateChat(chatData: ChatDTO): void;
    handleDeleteChat(chatData: ChatDTO): void;
    handleCreateMessage(chatData: ChatEntity, messagesData: TextPublicDTO): void;
    handleDeleteMessage(chatData: ChatEntity, messagesData: TextPublicDTO): void;
}
