import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { BadRequestException, Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatEntity } from './entity/chat.entity';
import { ChatCreateDTO } from './dto/chat.create.dto';
import { mockChatEntity } from './chat.controller.spec';
import { mockRepository, TypeMockRepository } from '@src/user/user.service.spec';

describe('ChatService', () => {
  let service: ChatService;
  let chatRepository: TypeMockRepository;
  const mockChatId = '123456789';

  beforeEach(async () => {
    // jest.clearAllMocks();
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
