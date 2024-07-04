import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserDTO } from '../dto/user.dto';
import { UserPublicDTO } from '../dto/user.public.dto';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ length: 255, name: 'name' })
  name: string;

  @Column({ length: 255, name: 'email' })
  email: string;

  @Column({ length: 255, name: 'password' })
  password: string;

  @Column({ name: 'created_time', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  static parserUserEntityToDTO = (userEntity: UserEntity): UserDTO => {
    const userDTO: UserDTO = {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      createdTime: userEntity.createdTime,
    };
    return userDTO;
  };

  static parserUserPucblicEntityToDTO = (userEntity: UserPublicDTO): UserPublicDTO => {
    const userDTO: UserPublicDTO = {
      name: userEntity.name,
      email: userEntity.email,
    };
    return userDTO;
  };
}
