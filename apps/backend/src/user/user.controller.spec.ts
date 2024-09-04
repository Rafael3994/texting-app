import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Logger } from '@nestjs/common';
import { UserCreatedDTO } from './dto/user.created.dto';
import { UserDTO } from './dto/user.dto';
import { UserEntity, UserRoles } from './entity/user.entity';
import { UserUpdatedDTO } from './dto/user.updated.dto';

export const mockRequest = {
  user: { id: '09398f56-93e4-4a2f-96e8-342683f7d35a', role: UserRoles.USER },
};

export const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};


export const mockedUsersValue: UserDTO[] = [
  {
    id: "40f6fb9b-9f77-4dbd-8497-1d030ba11081",
    name: "userTest",
    email: "userTest@gmail.com",
    password: "$2b$08$YoRkNwbaVrenijIxuuxG/eTHJv.It3m4Hu2YYLbjFFWaBAozH9k4W",
    role: UserRoles.ADMIN
  },
  {
    id: "09398f56-93e4-4a2f-96e8-342683f7d35a",
    name: "user1",
    email: "user1@gmail.com",
    password: "$2b$08$zYfB.m7VNCwFtqG4amUc0O9AiYfWD2ZutgBlLv7F5gmWI4BH.azJy",
    role: UserRoles.USER
  },
  {
    id: "0e2431eb-a822-4e34-aad1-490721012e87",
    name: "user2",
    email: "user2@gmail.com",
    password: "$2b$08$y8lyR4IHnkmjyluG8NAsAe043THzSxZJI9KM/nW76ka7L.ruQEIH6",
    role: UserRoles.USER
  },
];

export const mockedUsersEntityValue: UserEntity[] = [
  {
    id: "40f6fb9b-9f77-4dbd-8497-1d030ba11081",
    name: "userTest",
    email: "userTest@gmail.com",
    password: "$2b$08$YoRkNwbaVrenijIxuuxG/eTHJv.It3m4Hu2YYLbjFFWaBAozH9k4W",
    role: UserRoles.ADMIN,
    createdTime: undefined,
    chatsAsUser1: [],
    chatsAsUser2: [],
    texts: [],
  },
  {
    id: "09398f56-93e4-4a2f-96e8-342683f7d35a",
    name: "user1",
    email: "user1@gmail.com",
    password: "$2b$08$zYfB.m7VNCwFtqG4amUc0O9AiYfWD2ZutgBlLv7F5gmWI4BH.azJy",
    role: UserRoles.USER,
    createdTime: undefined,
    chatsAsUser1: [],
    chatsAsUser2: [],
    texts: [],
  },
  {
    id: "0e2431eb-a822-4e34-aad1-490721012e87",
    name: "user2",
    email: "user2@gmail.com",
    password: "$2b$08$y8lyR4IHnkmjyluG8NAsAe043THzSxZJI9KM/nW76ka7L.ruQEIH6",
    role: UserRoles.USER,
    createdTime: undefined,
    chatsAsUser1: [],
    chatsAsUser2: [],
    texts: [],
  },
];

export const mockUsersService = {
  findAllUsers: () => mockedUsersValue,
  findUserById: () => mockedUsersValue[0],
  createUser: () => mockedUsersValue,
  updateUser: () => mockedUsersValue,
  findUserByEmail: () => mockedUsersEntityValue[0],
  deleteUser: () => mockedUsersValue,
  areUsersExists: () => true || false,
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, Logger],
    })
      .overrideProvider(UserService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should be return all users',
      async () => {
        const findAllUsersSpy = jest.spyOn(service, 'findAllUsers');
        findAllUsersSpy.mockResolvedValue(mockedUsersEntityValue);
        await controller.findAllUsers(mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(mockedUsersValue);
      }
    );
    it('should be return all users but there are not', async () => {
      const findAllUsersSpy = jest.spyOn(service, 'findAllUsers');
      findAllUsersSpy.mockResolvedValue([]);

      await controller.findAllUsers(mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith([]);
    });

    it('should handle errors and return a 500 status', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(service, 'findAllUsers').mockRejectedValue(error);

      await controller.findAllUsers(mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something was bad.');
    });
  })

  describe('findUserById', () => {
    it('should return the user', async () => {
      const mockUserEntity = mockedUsersEntityValue[0];
      jest.spyOn(service, 'findUserById').mockResolvedValue(mockUserEntity);

      await controller.findUserById(mockResponse, mockRequest, mockUserEntity.id);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(UserEntity.parserUserEntityToDTO(mockUserEntity));
    });

    it('should return "Incorrect data" when selectedId is invalid', async () => {
      await controller.findUserById(mockResponse, mockRequest, undefined);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return "Not found" when user is not found', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValue(null);

      await controller.findUserById(mockResponse, mockRequest, '123456789234567');

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should handle errors and return a 500 status', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(service, 'findUserById').mockRejectedValue(error);

      await controller.findUserById(mockResponse, mockRequest, 'some-id');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
    });
  });

  describe('createUser', () => {
    it('should return the created user', async () => {
      const userEntity = mockedUsersEntityValue[0];
      const mockUser: UserCreatedDTO = {
        email: 'newUser@gmail.com',
        password: 'newUser',
        name: 'newUser',
      };

      jest.spyOn(service, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(service, 'createUser').mockResolvedValue(userEntity);

      await controller.createUser(mockResponse, mockUser);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(UserEntity.parserUserPucblicEntityToDTO(userEntity));
    });

    it('should return Incorrect data when passing wrong params', async () => {
      const invalidUser = { email: '', password: '', name: '' }; // Datos incorrectos

      await controller.createUser(mockResponse, invalidUser);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return It is already exist when finding the email', async () => {
      const mockedUserValue = mockedUsersEntityValue[0];
      const existingUser = {
        email: mockedUserValue.email,
        password: mockedUserValue.password,
        name: mockedUserValue.name,
      };

      jest.spyOn(service, 'findUserByEmail').mockResolvedValue(mockedUserValue);

      await controller.createUser(mockResponse, existingUser);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith("It's already exist");
    });

    it('should handle errors and return a 500 status', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(service, 'findUserById').mockRejectedValue(error);

      await controller.findUserById(mockResponse, mockRequest, 'some-id');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
    });
  });

  describe('updateUser', () => {
    it('should return the updated user.', async () => {
      const userEntity = mockedUsersEntityValue[0];
      const updatedUser: UserUpdatedDTO = {
        name: 'Updated Name',
        password: userEntity.password
      };

      jest.spyOn(service, 'findUserById').mockResolvedValue(userEntity);
      jest.spyOn(service, 'updateUser').mockResolvedValue({
        ...userEntity,
        ...updatedUser
      });

      await controller.updateUser(mockResponse, mockRequest, userEntity.id, updatedUser);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(UserEntity.parserUserPucblicEntityToDTO({
        ...userEntity,
        ...updatedUser
      }));
    });

    it('should return "Incorrect data." when data is invalid.', async () => {
      const invalidUser: UserUpdatedDTO = null;

      await controller.updateUser(mockResponse, mockRequest, 'some-id', invalidUser);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return "Not found." when the user is not found.', async () => {
      const validUser: UserUpdatedDTO = {
        name: 'Updated Name',
        password: 'password123'
      };

      jest.spyOn(service, 'findUserById').mockResolvedValue(null);

      await controller.updateUser(mockResponse, mockRequest, 'non-existing-id', validUser);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should handle errors and return a 500 status', async () => {
      const validUser: UserUpdatedDTO = {
        name: 'Updated Name',
        password: 'password123'
      };

      jest.spyOn(service, 'findUserById').mockRejectedValue(new Error('Internal error'));

      await controller.updateUser(mockResponse, mockRequest, 'some-id', validUser);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something was bad.');
    });
  });

  describe('deleteUserById', () => {
    it('should return the deleted user', async () => {
      const foundUser = mockedUsersEntityValue[0];

      jest.spyOn(service, 'findUserById').mockResolvedValue(foundUser);
      jest.spyOn(service, 'deleteUser').mockResolvedValue(1);

      await controller.deleteUserById(mockResponse, '123456789');

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(UserEntity.parserUserEntityToDTO(foundUser));
    });

    it('should return "Incorrect data." when id is missing', async () => {
      await controller.deleteUserById(mockResponse, '');

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return "Not found." when user does not exist', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValue(null);

      await controller.deleteUserById(mockResponse, '123456789');

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should return "Not delete." when deleteUser fails', async () => {
      const foundUser = mockedUsersEntityValue[0];

      jest.spyOn(service, 'findUserById').mockResolvedValue(foundUser);
      jest.spyOn(service, 'deleteUser').mockResolvedValue(0);

      await controller.deleteUserById(mockResponse, '123456789');

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not Delete.');
    });

    it('should handle errors and return a 500 status', async () => {
      jest.spyOn(service, 'findUserById').mockRejectedValue(new Error('Unexpected error'));

      await controller.deleteUserById(mockResponse, '123456789');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something was bad.');
    });

  });

});
