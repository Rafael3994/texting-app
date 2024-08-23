import { Injectable } from '@nestjs/common';
import { ChatDTO } from './dto/chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entity/chat.entity.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>
    ) { }

    findChatById(chatId: string, relations: string[] = []) {
        return this.chatRepository.findOne({
            where: { id: chatId },
            relations
        });
    }

    async findAll(): Promise<ChatEntity[]> {
        return this.chatRepository.find();
    }

    createChat(chat: ChatDTO): Promise<ChatEntity> {
        const newChat = new ChatEntity();
        newChat.userId1 = chat.userId1;
        newChat.userId2 = chat.userId2;
        return this.chatRepository.save(newChat);
    }

    async updateChat(id: string, chatFound: ChatDTO): Promise<ChatEntity> {
        return this.chatRepository.save(chatFound);
    }

    async deleteChat(id: string): Promise<number> {
        return (await this.chatRepository.delete(id)).affected;
    }
}
