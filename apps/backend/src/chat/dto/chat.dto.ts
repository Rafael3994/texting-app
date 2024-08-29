import { TextPublicDTO } from "src/text/dto/text.public.dto";
import { UserDTO } from "src/user/dto/user.dto";
import { UserPublicDTO } from "src/user/dto/user.public.dto";

export class ChatDTO {
    id: string;
    userId1: string;
    userId2: string;
    createdTime: Date;
    user1?: UserPublicDTO;
    user2?: UserPublicDTO;
    texts?: TextPublicDTO[];
}