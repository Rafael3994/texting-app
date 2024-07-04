import { UserEntity } from 'src/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ChatDTO } from '../dto/chat.dto';

@Entity({ name: 'chat' })
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ type: 'uuid', name: 'user_id_1' })
    userId1: string;

    @Column({ type: 'uuid', name: 'user_id_2' })
    userId2: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_time', default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id_1' })
    user1: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id_2' })
    user2: UserEntity;

    static parserChatEntityToDTO = (chatEntity: ChatEntity): ChatDTO => {
        const userDTO: ChatDTO = {
            id: chatEntity.id,
            userId1: chatEntity.userId1,
            userId2: chatEntity.userId2,
            createdTime: chatEntity.createdTime,
            user1: chatEntity.user1 && UserEntity.parserUserEntityToDTO(chatEntity.user1),
            user2: chatEntity.user1 && UserEntity.parserUserEntityToDTO(chatEntity.user2),
        };
        return userDTO;
      };
}
