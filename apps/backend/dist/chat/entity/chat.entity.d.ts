import { ChatDTO } from '../dto/chat.dto';
import { UserEntity } from '@src/user/entity/user.entity';
import { TextEntity } from '@src/text/entity/text.entity';
import { ChatPublicDTO } from '../dto/chat.public.dto';
export declare class ChatEntity {
    id: string;
    userId1: string;
    userId2: string;
    createdTime: Date;
    user1: UserEntity;
    user2: UserEntity;
    texts: TextEntity[];
    static parserChatEntityToDTO: (chatEntity: ChatEntity) => ChatDTO;
    static parserChatPublicEntityToDTO: (chatEntity: ChatEntity) => ChatPublicDTO;
}
