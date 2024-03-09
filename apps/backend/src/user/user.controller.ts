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
import { UserEntity } from './entity/user.entity.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  async findAll(@Res() response): Promise<any> {
    this.userService
      .findAll()
      .then((res: UserEntity[]) => {
        // Without content (204)
        if (res.length === 0) {
          return response
            .status(204)
            .send([]);
        }
        // With content (200)
        return response
          .status(200)
          .send(res.map((user) => UserEntity.paserUserEntityToDTO(user)));
      })
      .catch((err) => {
        // Error (500)
        return response.status(500).send('err: ' + err);
      });
  }

  @Get(':id')
  async findById(@Res() response, @Param('id') id: string): Promise<any> {
    // Bad request (400)
    if (!id) return response.status(400).send('id is required');
    this.userService
      .findById(id)
      .then((res: UserEntity) => {
        // Not Found (404)
        if (!res) {
          return response.status(404).send('User not found');
        }
        // With content (200)
        return response.status(200).send(UserEntity.paserUserEntityToDTO(res));
      })
      .catch((err) => {
        // Error (500)
        return response.status(500).send('err: ' + err);
      });
  }

  @Post('')
  async create(@Res() response, @Body() user: UserDTO): Promise<any> {
    // Bad request (400)
    if (!user) return response.status(400).send('user is required');
    // TODO: Sanitize user
    this.userService
      .create(user)
      .then((res: UserEntity) => {
        // Created (201)
        return response.status(201).send(UserEntity.paserUserEntityToDTO(res));
      })
      .catch((err) => {
        // Error (500)
        return response.status(500).send('err: ' + err);
      });
  }

  @Put('')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() user: UserDTO,
  ): Promise<any> {
    // Bad request (400)
    if (!user && !id)
      return response.status(400).send('id and user is required');
    // TODO: Sanitize user
    this.userService
      .update(id, user)
      .then((res: UserEntity) => {
        // Created (201)
        return response.status(201).send(UserEntity.paserUserEntityToDTO(res));
      })
      .catch((err) => {
        // Error (500)
        return response.status(500).send('err: ' + err);
      });
  }

  @Delete(':id')
  async deleteById(@Res() response, @Param('id') id: string): Promise<any> {
    // Bad request (400)
    if (!id) return response.status(400).send('id is required');
    this.userService
      .delete(id)
      .then((res: UserEntity) => {
        // Not Found (404)
        if (!res) {
          return response.status(404).send('User not found');
        }
        // With content (200)
        return response.status(200).send(UserEntity.paserUserEntityToDTO(res));
      })
      .catch((err) => {
        // Error (500)
        return response.status(500).send('err: ' + err);
      });
  }
}
