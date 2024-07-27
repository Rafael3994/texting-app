import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { isNotFound } from 'src/utils/classificatedHttpCode';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('')
  async findAllUsers(@Res() response): Promise<any> {
    try {
      this.userService
        .findAllUsers()
        .then((res: UserEntity[]) => {
          if (!isNotFound(res)) return response.status(204);
          return response
            .status(200)
            .send(
              res.map((user) => UserEntity.parserUserEntityToDTO(user))
            );
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      console.log('findAll', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @Get(':id')
  async findUserById(@Res() response, @Param('id') id: string): Promise<any> {
    try {

      if (!id) return response.status(400).send('Incorrect data.');

      this.userService
        .findUserById(id)
        .then((res: UserEntity) => {
          if (!isNotFound(res)) return response.status(404).send('Not found.');
          return response
            .status(200)
            .send(UserEntity.parserUserEntityToDTO(res));
        })
        .catch((err) => {
          throw new Error(err);
        });

    } catch (err) {
      console.log('findUserById', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @Post('')
  async createUser(@Res() response, @Body() user: UserDTO): Promise<any> {
    try {

      if (!user || !this.isSanitedUser(user)) return response.status(400).send('Incorrect data.');

      this.userService
        .createUser(user)
        .then((res: UserEntity) => {
          let _res = UserEntity.parserUserPucblicEntityToDTO(res);
          return response.status(201).send(_res);
        })
        .catch((err) => {
          throw new Error(err);
        });

    } catch (err) {
      console.log('createUser', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @Put('')
  async updateUser(
    @Res() response,
    @Param('id') id: string,
    @Body() user: UserDTO,
  ): Promise<any> {
    try {
      if (!user || !id || !this.isSanitedUser(user)) return response.status(400).send('Incorrect data.');

      this.userService
        .updateUser(id, user)
        .then((res: UserEntity) => {
          return response.status(201).send(UserEntity.parserUserEntityToDTO(res));
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      console.log('updateUser', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @Delete(':id')
  async deleteUserById(@Res() response, @Param('id') id: string): Promise<any> {
    try {
      if (!id) return response.status(400).send('Incorrect data.');
      this.userService
        .deleteUser(id)
        .then((res: UserEntity) => {
          if (!isNotFound(res)) return response.status(404).send('Not found.');
          return response
            .status(200)
            .send(UserEntity.parserUserEntityToDTO(res));
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      console.log('deleteUserById', err);
      return response.status(500).send('Something was bad.');
    }
  }

  isSanitedUser = (user) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(user.email) || user.name.length < 3 || user.password.length < 3) {
      return false;
    }
    return true;
  };
}
