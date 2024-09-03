import { UserDTO } from "@src/user/dto/user.dto";
import { UserRoles } from "@src/user/entity/user.entity";

export const selectIdToDoTheSearch = (user: UserDTO, idDefault: string) => {
    if (!idDefault) return null;
    if (user.role === UserRoles.ADMIN) {
        if (!idDefault) return null;
        return idDefault;
    } else {
        return user.id;
    }
}