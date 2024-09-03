import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide:
            getRepositoryToken(UserEntity),
          useValue: createMockRepository(),
        }
      ],
    })
      .compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository>(getRepositoryToken(UserEntity));
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  describe('findUserByName', () => {
    describe('when pass username', () => {
      it('should return the user name', async () => {
        const username = 'user1';
        const expectedUser = {};
        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.findUserByName(username);
        expect(user).toEqual(expectedUser);
      });
    });
    describe('when not pass username', () => {
      it('should return a BadRequestException', async () => {
        const username = '';
        try {
          await service.findUserByName(username);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });

  describe('findUserById', () => {
    describe('when pass Id', () => {
      it('should return the user', async () => {
        const userId = '09398f56-93e4-4a2f-96e8-342683f7d35a';
        const expectedUser = {};

        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.findUserByName(userId);
        expect(user).toEqual(expectedUser);
      });
    });
    describe('when not pass id', () => {
      it('should return a BadRequestException', async () => {
        const username = '';
        try {
          await service.findUserByName(username);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
