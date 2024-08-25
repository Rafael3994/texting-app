import { UserDTO } from "src/user/dto/user.dto";
import { UserRoles } from "src/user/entity/user.entity";

export const isOwnOrAdmin = (userSignIn: UserDTO, idPass: string): boolean => {
    if (userSignIn.role === UserRoles.ADMIN) {
        return true;
    } else {
        return userSignIn.id === idPass;
    }
}