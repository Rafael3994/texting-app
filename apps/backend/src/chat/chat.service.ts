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

    findOne(chatId: string) {
        return this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['user1', 'user2', 'texts']
        });
    }

    async findAll(): Promise<ChatEntity[]> {
        return this.chatRepository.find();
    }

    create(chat: ChatDTO): Promise<ChatEntity> {
        const newChat = new ChatEntity();
        newChat.userId1 = chat.userId1;
        newChat.userId2 = chat.userId2;
        return this.chatRepository.save(newChat);
    }

    async update(id: string, chat: ChatDTO): Promise<ChatEntity> {
        const chatFound = await this.chatRepository.findOneBy({ id });
        if (!chatFound) return null;
        chatFound.userId1 = chat.userId1;
        chatFound.userId2 = chat.userId2;
        return this.chatRepository.save(chatFound);
    }

    async delete(id: string): Promise<ChatEntity> {
        const userFound = await this.chatRepository.findOneBy({ id });
        if (!userFound) return null;
        await this.chatRepository.delete(id);
        return userFound;
    }
}
