import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TextDTO } from '../dto/text.dto';
import { TextPublicDTO } from '../dto/text.public.dto';
import { UserEntity } from '@src/user/entity/user.entity';
import { ChatEntity } from '@src/chat/entity/chat.entity';

@Entity({ name: 'text' })
export class TextEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ type: 'uuid', name: 'chat_id' })
    chatId: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @Column({ length: 255 })
    text: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_time', default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @ManyToOne(() => ChatEntity, (chat: ChatEntity) => chat.texts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chat_id' })
    chat: ChatEntity;

    @ManyToOne(() => UserEntity, user => user.texts)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    static parserTextEntityToDTO = (textEntity: TextEntity): TextDTO => {
        const textDTO: TextDTO = {
            id: textEntity.id,
            userId: textEntity.userId,
            chatId: textEntity.chatId,
            text: textEntity.text,
            user: textEntity.user && UserEntity.parserUserPublicEntityToDTO(textEntity.user),
            chat: textEntity.chat && ChatEntity.parserChatEntityToDTO(textEntity.chat),
        };
        return textDTO;
    };

    static parserTextPublicEntityToDTO = (textEntity: TextEntity): TextPublicDTO => {
        const textDTO: TextPublicDTO = {
            id: textEntity.id,
            userId: textEntity.userId,
            chatId: textEntity.chatId,
            text: textEntity.text,
            createdTime: textEntity.createdTime,
        };
        return textDTO;
    }
}
