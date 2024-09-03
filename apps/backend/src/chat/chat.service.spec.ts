import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { BadRequestException, Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatEntity } from './entity/chat.entity';
import { Repository } from 'typeorm';
import { ChatDTO } from './dto/chat.dto';
import { mockedUsersEntityValue } from '@src/user/user.controller.spec';
import { ChatCreateDTO } from './dto/chat.create.dto';

type TypeMockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = <T = any>(): TypeMockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockChatDTO: ChatDTO[] = [
  {
    id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId1: "09398f56-93e4-4a2f-96e8-342683f7d35a",
    userId2: "0e2431eb-a822-4e34-aad1-490721012e87",
    createdTime: new Date(),
  },
  {
    id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId1: "09398f56-93e4-4a2f-96e8-342683f7d35a",
    userId2: "0e2431eb-a822-4e34-aad1-490721012e87",
    createdTime: new Date(),
  },
]

const mockChatEntity: ChatEntity[] = [
  {
    id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId1: "09398f56-93e4-4a2f-96e8-342683f7d35a",
    userId2: "0e2431eb-a822-4e34-aad1-490721012e87",
    createdTime: new Date(),
    user1: mockedUsersEntityValue[0],
    user2: mockedUsersEntityValue[1],
    texts: []
  },
  {

    id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId1: "09398f56-93e4-4a2f-96e8-342683f7d35a",
    userId2: "0e2431eb-a822-4e34-aad1-490721012e87",
    createdTime: new Date(),
    user1: mockedUsersEntityValue[0],
    user2: mockedUsersEntityValue[1],
    texts: []
  },
]

describe('ChatService', () => {
  let service: ChatService;
  let chatRepository: TypeMockRepository;
  const mockChatId = '123456789';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        Logger,
        {
          provide:
            getRepositoryToken(ChatEntity),
          useValue: mockRepository(),
        }
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatRepository = module.get<TypeMockRepository>(getRepositoryToken(ChatEntity));
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  describe('findChatById', () => {
    it('should be return a chat.', async () => {
      try {
        jest.spyOn(chatRepository, 'findOne').mockResolvedValue(mockChatEntity[0])
        const user = await service.findChatById(mockChatId);
        expect(mockChatEntity[0]).toEqual(user);
      } catch (error) { }
    });

    it('should be return BadRequestException.', async () => {
      try {
        await service.findChatById('');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findAll', () => {
    it('should be return chats.', async () => {
      try {
        jest.spyOn(chatRepository, 'find').mockResolvedValue(mockChatEntity);
        const users = await service.findAll()
        expect(users).toEqual(mockChatEntity);
      } catch (error) { }
    });
  });

  describe('createChat', () => {
    it('should be return the created chat', async () => {
      try {
        const newChat: ChatCreateDTO = {
          userId1: mockChatId,
          userId2: mockChatId,
        }
        jest.spyOn(chatRepository, 'save').mockResolvedValue(mockChatEntity[0]);
        const newChatCreated = await service.createChat(newChat);
        expect(newChatCreated).toBe(mockChatEntity[0]);
      } catch (error) { }
    });

    it('should be return BadRequestException', async () => {
      try {
        await service.createChat(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('updateChat', () => {
    it('should be return the updated chat.', async () => {
      try {
        const newChat: ChatCreateDTO = {
          userId1: mockChatId,
          userId2: mockChatId,
        };

        jest.spyOn(chatRepository, 'save').mockResolvedValue(mockChatEntity[0]);
        const updatedChat = await service.updateChat(newChat);
        expect(updatedChat).toBe(mockChatEntity[0]);
      } catch (error) { }
    });

    it('should be return BadRequestException.', async () => {
      try {
        await service.updateChat(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteChat', () => {
    it('should be return the deleted chat.', async () => {
      try {
        const deleteResult = { affected: 1 };
        jest.spyOn(chatRepository, 'delete').mockResolvedValue(deleteResult);

        const result = await service.deleteChat(mockChatId);
        expect(result).toBe(deleteResult);
      } catch (error) { }
    });

    it('should be return BadRequestException.', async () => {
      try {
        await service.deleteChat(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
