import { TextDTO } from '../dto/text.dto';
import { TextPublicDTO } from '../dto/text.public.dto';
import { UserEntity } from '@src/user/entity/user.entity';
import { ChatEntity } from '@src/chat/entity/chat.entity';
export declare class TextEntity {
    id: string;
    chatId: string;
    userId: string;
    text: string;
    createdTime: Date;
    chat: ChatEntity;
    user: UserEntity;
    static parserTextEntityToDTO: (textEntity: TextEntity) => TextDTO;
    static parserTextPublicEntityToDTO: (textEntity: TextEntity) => TextPublicDTO;
}
