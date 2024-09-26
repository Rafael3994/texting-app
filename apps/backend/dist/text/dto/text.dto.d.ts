import { ChatDTO } from "@src/chat/dto/chat.dto";
import { UserPublicDTO } from "@src/user/dto/user.public.dto";
export declare class TextDTO {
    id: string;
    userId: string;
    chatId: string;
    text: string;
    createdTime?: Date;
    user?: UserPublicDTO;
    chat?: ChatDTO;
}
