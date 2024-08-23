import { ChatDTO } from "src/chat/dto/chat.dto";
import { UserDTO } from "src/user/dto/user.dto";

export class TextDTO {
    id: string;
    userId: string;
    chatId: string;
    text: string;
    createdTime?: Date;
    user?: UserDTO;
    chat?: ChatDTO;
}