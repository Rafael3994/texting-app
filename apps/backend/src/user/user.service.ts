import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRoles } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { UserUpdatedDTO } from './dto/user.updated.dto';
const bcrypt = require('bcrypt');

export const SALTROUNDS = 8;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({ select: ["id", "name", "email"] });
  }

  async findUserByName(username: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { name: username } });

  }

  async findUserById(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { id }, select: ["id", "name", "email"] })
  }

  async findUserByEmail(
    emial: string,
    select: (keyof UserEntity)[] = ["id", "name", "email"]
  ): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { email: emial }, select })
  }

  async createUser(user: UserDTO): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.role = UserRoles.USER;
    const encryptPass = await bcrypt.hash(user.password, SALTROUNDS);
    newUser.password = encryptPass;
    return this.usersRepository.save(newUser);
  }

  async updateUser(user: UserUpdatedDTO): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<number> {
    return (await this.usersRepository.delete(id)).affected;
  }

  async areUsersExists(userId1, userId2) {
    const user1 = await this.findUserById(userId1);
    const user2 = await this.findUserById(userId2);

    if (!user1 || !user2) return false;
    return true;
  }
}
