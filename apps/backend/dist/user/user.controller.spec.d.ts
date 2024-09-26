/// <reference types="jest" />
import { UserDTO } from './dto/user.dto';
import { UserEntity, UserRoles } from './entity/user.entity';
import { UserPublicDTO } from './dto/user.public.dto';
export declare const mockResponse: {
    status: jest.Mock<any, any>;
    send: jest.Mock<any, any>;
    json: jest.Mock<any, any>;
};
export declare const mockedUsersDTO: UserDTO[];
export declare const mockedUsersPublicDTO: UserPublicDTO[];
export declare const mockedUsersEntity: UserEntity[];
export declare const mockRequest: {
    user: {
        id: string;
        role: UserRoles;
    };
};
export declare const mockUsersService: {
    findAllUsers: () => UserEntity[];
    findUserById: () => UserEntity;
    createUser: () => UserEntity[];
    updateUser: () => UserEntity[];
    findUserByEmail: () => UserEntity;
    deleteUser: () => 0 | 1;
    areUsersExists: () => boolean;
};
