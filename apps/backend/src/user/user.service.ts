import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
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

  async findUserById(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { id }, select: ["id", "name", "email"] })
  }

  async findUserByEmail(emial: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { email: emial }, select: ["id", "name", "email"] })
  }

  async createUser(user: UserDTO): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.name = user.name;
    newUser.email = user.email;
    const encryptPass = await bcrypt.hash(user.password, SALTROUNDS);
    newUser.password = encryptPass;
    return this.usersRepository.save(newUser);
  }

  async updateUser(id: string, user: UserUpdatedDTO): Promise<UserEntity> {
    const userFound = await this.usersRepository.findOneBy({ id });
    if (!userFound) return null;
    userFound.name = user.name;
    userFound.password = user.password;
    return this.usersRepository.save(userFound);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    const userFound = await this.usersRepository.findOneBy({ id });
    if (!userFound) return null;
    await this.usersRepository.delete(id);
    return userFound;
  }

  async areUsersExists(userId1, userId2) {
    const user1 = await this.findUserById(userId1);
    const user2 = await this.findUserById(userId2);
    console.log('user1', user1);
    console.log('user2', user2);

    if (!user1 || !user2) return false;
    return true;
  }
}
