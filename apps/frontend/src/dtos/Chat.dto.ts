import { TextPublicDTO } from "./Text.dto";
import { UserPublicDTO } from "./User.public.dto";


export interface ChatDTO {
    id: string;
    userId1: string;
    userId2: string;
    createdTime: Date;
    user1?: UserPublicDTO;
    user2?: UserPublicDTO;
    texts?: TextPublicDTO[];
}