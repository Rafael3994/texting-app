import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity.dto';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({ select: ["id", "name", "email"] });
  }

  async findById(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { id }, select: ["id", "name", "email"] });
  }

  async create(user: UserDTO): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = user.password;
    return this.usersRepository.save(newUser);
  }

  async update(id: string, user: UserDTO): Promise<UserEntity> {
    const userFound = await this.usersRepository.findOneBy({ id });
    if (!userFound) return null;
    userFound.name = user.name;
    userFound.email = user.email;
    userFound.password = user.password;
    return this.usersRepository.save(userFound);
  }

  async delete(id: string): Promise<UserEntity> {
    const userFound = await this.usersRepository.findOneBy({ id });
    if (!userFound) return null;
    await this.usersRepository.delete(id);
    return userFound;
  }
}
