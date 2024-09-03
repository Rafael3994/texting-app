import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatDTO } from './dto/chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entity/chat.entity';
import { Repository } from 'typeorm';
import { ChatCreateDTO } from './dto/chat.create.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
    ) { }

    findChatById(chatId: string, relations: string[] = []) {
        if (!chatId) throw new BadRequestException();
        return this.chatRepository.findOne({
            where: { id: chatId },
            relations
        });
    }

    findAll(): Promise<ChatEntity[]> {
        return this.chatRepository.find();
    }

    createChat(chat: ChatCreateDTO): Promise<ChatEntity> {
        if (!chat) throw new BadRequestException();
        const newChat = new ChatEntity();
        newChat.userId1 = chat.userId1;
        newChat.userId2 = chat.userId2;
        return this.chatRepository.save(newChat);
    }

    updateChat(chat: ChatCreateDTO): Promise<ChatEntity> {
        if (!chat) throw new BadRequestException();
        return this.chatRepository.save(chat);
    }

    async deleteChat(id: string): Promise<number> {
        if (!id) throw new BadRequestException();
        return (await this.chatRepository.delete(id)).affected;
    }
}
