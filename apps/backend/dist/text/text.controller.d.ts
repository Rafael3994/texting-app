import { Logger } from '@nestjs/common';
import { TextService } from './text.service';
import { UserService } from '@src/user/user.service';
import { ChatService } from '@src/chat/chat.service';
import { TextCreateDTO } from './dto/text.create.dto';
import { WebSocketsGateway } from '@src/web-sockets/webSockets.gateway';
export declare class TextController {
    private textService;
    private userService;
    private chatService;
    private logger;
    private webSocketsGateway;
    constructor(textService: TextService, userService: UserService, chatService: ChatService, logger: Logger, webSocketsGateway: WebSocketsGateway);
    findTextById(response: any, request: any, id: string): Promise<any>;
    findAllTextByChatId(response: any, request: any, id: string): Promise<any>;
    createText(response: any, request: any, text: TextCreateDTO): Promise<any>;
    updateText(response: any, request: any, id: string, text: string): Promise<any>;
    deleteText(response: any, request: any, id: string): Promise<any>;
    areIdsExists(idUser: string, idChat: string): Promise<boolean>;
    isSanitedText(newText: TextCreateDTO): boolean;
}
