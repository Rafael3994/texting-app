import { ChatDTO } from "src/chat/dto/chat.dto";
import { UserDTO } from "src/user/dto/user.dto";
import { UserPublicDTO } from "src/user/dto/user.public.dto";

export class TextCreateDTO {
    userId: string;
    chatId: string;
    text: string;
}