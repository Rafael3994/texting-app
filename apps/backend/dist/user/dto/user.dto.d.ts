import { UserRoles } from "../entity/user.entity";
export declare class UserDTO {
    readonly id?: string;
    readonly name: string;
    readonly email: string;
    readonly password?: string;
    readonly role: UserRoles;
    readonly createdTime?: Date;
}
