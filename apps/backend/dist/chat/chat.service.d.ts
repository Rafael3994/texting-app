import { ChatEntity } from './entity/chat.entity';
import { Repository } from 'typeorm';
import { ChatCreateDTO } from './dto/chat.create.dto';
export declare class ChatService {
    private chatRepository;
    constructor(chatRepository: Repository<ChatEntity>);
    findChatById(chatId: string, relations?: string[]): Promise<ChatEntity>;
    findAllChatByUserId(userId: string): Promise<ChatEntity[]>;
    findAll(): Promise<ChatEntity[]>;
    createChat(chat: ChatCreateDTO): Promise<ChatEntity>;
    updateChat(chat: ChatCreateDTO): Promise<ChatEntity>;
    deleteChat(id: string): Promise<number>;
}
