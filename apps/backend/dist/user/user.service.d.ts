import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserUpdatedDTO } from './dto/user.updated.dto';
import { UserCreatedDTO } from './dto/user.created.dto';
export declare const SALTROUNDS = 8;
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    findAllUsers(): Promise<UserEntity[]>;
    findUserByName(username: string): Promise<UserEntity>;
    findUserById(id: string): Promise<UserEntity>;
    findUserByEmail(email: string, select?: (keyof UserEntity)[]): Promise<UserEntity>;
    createUser(user: UserCreatedDTO): Promise<UserEntity>;
    updateUser(user: UserUpdatedDTO): Promise<UserEntity>;
    deleteUser(id: string): Promise<number>;
    areUsersExists(userId1: any, userId2: any): Promise<boolean>;
}
