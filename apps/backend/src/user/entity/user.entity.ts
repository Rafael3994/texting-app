import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserDTO } from '../dto/user.dto';
import { UserPublicDTO } from '../dto/user.public.dto';
import { ChatEntity } from 'src/chat/entity/chat.entity.dto';
import { TextEntity } from 'src/text/entity/text.entity';

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

  @OneToMany(() => ChatEntity, chat => chat.user1)
  chatsAsUser1: ChatEntity[];

  @OneToMany(() => ChatEntity, chat => chat.user2)
  chatsAsUser2: ChatEntity[];

  @OneToMany(() => TextEntity, text => text.user)
  texts: Text[];

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
