import { UserDTO } from "src/user/dto/user.dto";

export const isOwn = (userSignIn: UserDTO, idPass: string): boolean => {
    return userSignIn.id === idPass;
}