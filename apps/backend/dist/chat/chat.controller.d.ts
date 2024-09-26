import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserService } from '@src/user/user.service';
import { TextService } from '@src/text/text.service';
import { ChatCreateDTO } from './dto/chat.create.dto';
import { WebSocketsGateway } from '../web-sockets/webSockets.gateway';
export declare class ChatController {
    private chatService;
    private userService;
    private textService;
    private logger;
    private webSocketsGateway;
    constructor(chatService: ChatService, userService: UserService, textService: TextService, logger: Logger, webSocketsGateway: WebSocketsGateway);
    findChatById(response: any, request: any, chatId: string): Promise<any>;
    findAllChatByUserId(response: any, request: any, userId: string): Promise<any>;
    createChat(response: any, chat: ChatCreateDTO): Promise<any>;
    updateChat(response: any, request: any, id: string, chat: ChatCreateDTO): Promise<any>;
    deleteById(response: any, request: any, id: string): Promise<any>;
}
