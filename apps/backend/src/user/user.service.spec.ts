import { Test, TestingModule } from '@nestjs/testing';
import { SALTROUNDS, UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity, UserRoles } from './entity/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { UserUpdatedDTO } from './dto/user.updated.dto';
import { mockedUsersEntityValue } from './user.controller.spec';
const bcrypt = require('bcrypt');

type TypeMockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = <T = any>(): TypeMockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: TypeMockRepository;
  const userId = '123456789';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide:
            getRepositoryToken(UserEntity),
          useValue: mockRepository(),
        }
      ],
    })
      .compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<TypeMockRepository>(getRepositoryToken(UserEntity));
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', name: 'User One', email: 'userone@example.com' },
        { id: '2', name: 'User Two', email: 'usertwo@example.com' },
      ];

      userRepository.find.mockReturnValue(mockUsers);
      const result = await service.findAllUsers();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('findUserByName', () => {
    it('should return the user name', async () => {
      const username = 'user1';
      const expectedUser = {};
      userRepository.findOne.mockReturnValue(expectedUser);
      const user = await service.findUserByName(username);
      expect(user).toEqual(expectedUser);
    });

    it('should return a BadRequestException', async () => {
      const username = '';
      try {
        await service.findUserByName(username);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findUserById', () => {
    it('should return the user', async () => {
      const expectedUser = mockedUsersEntityValue[0];

      userRepository.findOne.mockReturnValue(expectedUser);
      const user = await service.findUserByName(userId);
      expect(user).toEqual(expectedUser);
    });

    it('should return a BadRequestException', async () => {
      const username = '';
      try {
        await service.findUserByName(username);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findUserByEmail', () => {
    it('should return the user', async () => {
      const mockUser: UserEntity = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      } as UserEntity;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: ["id", "name", "email"],
      });
    });

    it('should return a BadRequestException', async () => {
      await expect(service.findUserByEmail('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('createUser', () => {
    it('should return the created user', async () => {
      const userDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedpassword';
      const savedUser = new UserEntity();
      savedUser.name = userDto.name;
      savedUser.email = userDto.email;
      savedUser.password = hashedPassword;
      savedUser.role = UserRoles.USER;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

      const result = await service.createUser(userDto);

      expect(result).toEqual(savedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, SALTROUNDS);
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        name: userDto.name,
        email: userDto.email,
        password: hashedPassword,
      }));
    });

    it('should return a BadRequestException', async () => {
      await expect(service.createUser(null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUser', () => {
    it('should return the updated user', async () => {
      // Mock user data
      const userDto: UserUpdatedDTO = { name: 'Updated Name', password: 'New Password' };
      const updatedUser: UserEntity = { ...userDto } as UserEntity;

      // Mock the repository method
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      // Call the method
      const result = await service.updateUser(userDto);

      // Assertions
      expect(result).toEqual(updatedUser);
      expect(userRepository.save).toHaveBeenCalledWith(userDto);
    });

    it('should return a BadRequestException when no user data is provided', async () => {
      // Call the method with no data
      await expect(service.updateUser(null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('should return the deleted user', async () => {
      const deleteResult = { affected: 1 };

      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await service.deleteUser(userId);

      expect(result).toBe(deleteResult.affected);
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should return a BadRequestException', async () => {
      await expect(service.deleteUser(null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('areUsersExists', () => {
    it('should return true if both users exist', async () => {
      const userId1 = '1';
      const userId2 = '2';

      jest.spyOn(service, 'findUserById')
        .mockImplementation(async (id: string) => {
          if (id === userId1) return mockedUsersEntityValue[0];
          if (id === userId2) return mockedUsersEntityValue[1];
          return null;
        });

      const result = await service.areUsersExists(userId1, userId2);
      expect(result).toBe(true);
    });

    it('should return false if at least one user does not exist', async () => {
      const userId1 = '1';
      const userId2 = '2';

      jest.spyOn(service, 'findUserById')
        .mockImplementation(async (id: string) => {
          if (id === userId1) return mockedUsersEntityValue[0];
          return null;
        });

      const result = await service.areUsersExists(userId1, userId2);
      expect(result).toBe(false);
    });
  });
});
