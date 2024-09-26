import { UserDTO } from '../dto/user.dto';
import { UserPublicDTO } from '../dto/user.public.dto';
import { ChatEntity } from '@src/chat/entity/chat.entity';
export declare enum UserRoles {
    USER = "user",
    ADMIN = "admin"
}
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRoles;
    createdTime: Date;
    chatsAsUser1: ChatEntity[];
    chatsAsUser2: ChatEntity[];
    texts: Text[];
    static parserUserEntityToDTO: (userEntity: UserEntity) => UserDTO;
    static parserUserPublicEntityToDTO: (userEntity: UserPublicDTO) => UserPublicDTO;
}
