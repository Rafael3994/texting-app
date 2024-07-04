import { UserDTO } from "src/user/dto/user.dto";

export class ChatDTO {
    id: string;
    userId1: string;
    userId2: string;
    createdTime: Date;
    user1: UserDTO;
    user2: UserDTO;
}