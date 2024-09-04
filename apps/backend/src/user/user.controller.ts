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
import { UserEntity } from './entity/user.entity';
import { isNotFound } from '@src/utils/classificatedHttpCode';
import { UserUpdatedDTO } from './dto/user.updated.dto';
import { Public } from '@src/auth/public.decorator';
import { Roles } from '@src/auth/roles.decorator';
import { RolesGuard } from '@src/auth/roles.guard';
import { selectIdToDoTheSearch } from '@src/utils/selectIdToDoTheSearch';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, PickType } from '@nestjs/swagger';
import { UserPublicDTO } from './dto/user.public.dto';
import { UserCreatedDTO } from './dto/user.created.dto';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) { }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users.',
    description: 'This endpoint is only for role admins'
  })
  @ApiResponse({
    status: 200,
    description: 'The list of items has been successfully retrieved.',
    type: UserDTO,
    isArray: true,
  })
  @Get('')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async findAllUsers(@Res() response): Promise<any> {
    try {
      const res: UserEntity[] = await this.userService.findAllUsers();
      if (isNotFound(res)) {
        return response.status(204).send([]);
      }

      return response.status(200).send(
        res.map((user) => UserEntity.parserUserEntityToDTO(user))
      );
    } catch (err) {
      this.logger.error('findAllUsers', err);
      return response.status(500).send('Something was bad.');
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a user by id.',
    description: 'If you use a admin user you can search all users, but if you use a user standard only search yourself'
  })
  @ApiResponse({
    status: 200,
    description: 'The list of items has been successfully retrieved.',
    type: [PickType(UserDTO, ['id', 'name', 'email'] as const)],
  })
  @Get(':id')
  async findUserById(
    @Res() response,
    @Req() request,
    @Param('id') id: string
  ): Promise<any> {
    try {
      const selectedId = selectIdToDoTheSearch(request.user, id);
      if (!selectedId) {
        return response.status(400).send('Incorrect data.');
      }
      const user: UserEntity = await this.userService.findUserById(selectedId);
      if (isNotFound(user)) {
        return response.status(404).send('Not found.');
      }
      return response.status(200).send(UserEntity.parserUserEntityToDTO(user));
    } catch (err) {
      this.logger.error('findUserById', err);
      return response.status(500).send('Something went wrong.');
    }
  }

  @ApiOperation({
    summary: 'Create user',
    description: 'The endpoint is public.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the new user.',
    type: UserPublicDTO,
  })
  @Public()
  @Post('')
  async createUser(@Res() response, @Body() user: UserCreatedDTO): Promise<any> {
    try {
      if (!user || !this.isSanitedUser(user)) {
        return response.status(400).send('Incorrect data.');
      }

      const existingUser = await this.userService.findUserByEmail(user.email);
      if (existingUser) {
        return response.status(404).send(`It's already exist`);
      }

      const createdUser = await this.userService.createUser(user);
      const publicUser = UserEntity.parserUserPublicEntityToDTO(createdUser);

      return response.status(201).send(publicUser);

    } catch (err) {
      this.logger.error('createUser', err);
      return response.status(500).send('Something was bad.');
    }
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user.',
    description: 'If you use a admin user you can update the user pass, but if you use a user standard only updated yourself'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user.',
    type: UserPublicDTO,
  })
  @Put(':id')
  async updateUser(
    @Res() response,
    @Req() request,
    @Param('id') id: string,
    @Body() user: UserUpdatedDTO,
  ): Promise<any> {
    try {
      const selectedId = selectIdToDoTheSearch(request.user, id);
      if (!selectedId) {
        return response.status(400).send('Incorrect data.');
      }

      if (!user || !this.isSanitedUser(user)) {
        return response.status(400).send('Incorrect data.');
      }

      const foundUser = await this.userService.findUserById(selectedId);
      if (!foundUser) {
        return response.status(404).send('Not found.');
      }

      const updatedUser = await this.userService.updateUser({
        ...foundUser,
        ...user,
      });

      return response.status(201).send(
        UserEntity.parserUserPublicEntityToDTO(updatedUser)
      );
    } catch (err) {
      this.logger.error('updateUser', err);
      return response.status(500).send('Something was bad.');
    }
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user.',
    description: 'This endpoint is only used for the role admin.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted user.',
    type: UserDTO,
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteUserById(@Res() response, @Param('id') id: string): Promise<any> {
    try {
      if (!id) {
        return response.status(400).send('Incorrect data.');
      }

      const foundUser = await this.userService.findUserById(id);
      if (!foundUser) {
        return response.status(404).send('Not found.');
      }

      const result = await this.userService.deleteUser(id);
      if (result > 0) {
        return response.status(200).send(UserEntity.parserUserEntityToDTO(foundUser));
      } else {
        return response.status(404).send('Not Delete.');
      }

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
