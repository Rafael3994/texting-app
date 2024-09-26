import { Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdatedDTO } from './dto/user.updated.dto';
import { UserCreatedDTO } from './dto/user.created.dto';
export declare class UserController {
    private userService;
    private logger;
    constructor(userService: UserService, logger: Logger);
    findAllUsers(response: any): Promise<any>;
    findUserById(response: any, request: any, id: string): Promise<any>;
    createUser(response: any, user: UserCreatedDTO): Promise<any>;
    updateUser(response: any, request: any, id: string, user: UserUpdatedDTO): Promise<any>;
    deleteUserById(response: any, id: string): Promise<any>;
    isSanitedUser: (user: any) => boolean;
}
