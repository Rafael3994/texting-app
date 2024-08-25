import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { UserEntity, UserRoles } from './entity/user.entity';
import { isNotFound } from 'src/utils/classificatedHttpCode';
import { UserUpdatedDTO } from './dto/user.updated.dto';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { selectIdToDoTheSearch } from 'src/utils/selectIdToDoTheSearch';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) { }

  @Get('')
  @Roles('admin')
  @UseGuards(RolesGuard)
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
      this.logger.error('findAllUsers', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @Get(':id')
  async findUserById(
    @Res() response,
    @Req() request,
    @Param('id') id: string
  ): Promise<any> {
    try {
      const selectedId = selectIdToDoTheSearch(request.user, id);
      if (!selectedId) return response.status(400).send('Incorrect data.');

      this.userService
        .findUserById(selectedId)
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
      this.logger.error('findUserById', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @Public()
  @Post('')
  async createUser(@Res() response, @Body() user: UserDTO): Promise<any> {
    try {

      if (!user || !this.isSanitedUser(user)) return response.status(400).send('Incorrect data.');

      if (await this.userService.findUserByEmail(user.email))
        return response.status(404).send(`It's already exist`);

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
      this.logger.error('createUser', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @Put(':id')
  async updateUser(
    @Res() response,
    @Req() request,
    @Param('id') id: string,
    @Body() user: UserUpdatedDTO,
  ): Promise<any> {
    try {
      const selectedId = selectIdToDoTheSearch(request.user, id);
      if (!selectedId) return response.status(400).send('Incorrect data.');

      if (!user || !this.isSanitedUser(user)) return response.status(400).send('Incorrect data.');

      const foundUser = await this.userService.findUserById(selectedId)
      if (!foundUser)
        return response.status(404).send('Not found.');

      this.userService
        .updateUser(
          {
            ...foundUser,
            ...user,
          }
        )
        .then((res: UserEntity) => {
          return response.status(201).send(UserEntity.parserUserEntityToDTO(res));
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      this.logger.error('updateUser', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteUserById(@Res() response, @Param('id') id: string): Promise<any> {
    try {
      if (!id) return response.status(400).send('Incorrect data.');

      const foundUser = await this.userService.findUserById(id)
      if (!foundUser)
        return response.status(404).send('Not found.');

      this.userService
        .deleteUser(id)
        .then((res) => {
          if (res > 0) return response.status(200).send(UserEntity.parserUserEntityToDTO(foundUser));
          return response.status(404).send('Not Delete.');
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      this.logger.error('deleteUserById', err);
      return response.status(500).send('Something was bad.');
    }
  }

  isSanitedUser = (user) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ((user.email && !regex.test(user.email)) || user.name.length < 3 || user.password.length < 3) {
      return false;
    }
    return true;
  };
}
