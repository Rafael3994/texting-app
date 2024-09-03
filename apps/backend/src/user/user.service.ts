import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRoles } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserUpdatedDTO } from './dto/user.updated.dto';
import { UserCreatedDTO } from './dto/user.created.dto';
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
    if (!username) throw new BadRequestException();
    return await this.usersRepository.findOne({ where: { name: username } });
  }

  async findUserById(id: string): Promise<UserEntity> {
    if (!id) throw new BadRequestException();
    return this.usersRepository.findOne({ where: { id }, select: ["id", "name", "email"] })
  }

  async findUserByEmail(
    email: string,
    select: (keyof UserEntity)[] = ["id", "name", "email"]
  ): Promise<UserEntity> {
    if (!email) throw new BadRequestException();
    return this.usersRepository.findOne({ where: { email: email }, select })
  }

  async createUser(user: UserCreatedDTO): Promise<UserEntity> {
    if (!user) throw new BadRequestException();
    const newUser = new UserEntity();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.role = UserRoles.USER;
    const encryptPass = await bcrypt.hash(user.password, SALTROUNDS);
    newUser.password = encryptPass;
    return this.usersRepository.save(newUser);
  }

  async updateUser(user: UserUpdatedDTO): Promise<UserEntity> {
    if (!user) throw new BadRequestException();
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<number> {
    if (!id) throw new BadRequestException();
    return (await this.usersRepository.delete(id)).affected;
  }

  async areUsersExists(userId1, userId2) {
    const user1 = await this.findUserById(userId1);
    const user2 = await this.findUserById(userId2);

    if (!user1 || !user2) return false;
    return true;
  }
}
