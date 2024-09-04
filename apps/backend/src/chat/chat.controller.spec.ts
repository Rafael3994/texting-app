import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatEntity } from './entity/chat.entity';
import { mockedUsersEntity, mockRequest, mockResponse, mockUsersService } from '@src/user/user.controller.spec';
import { ChatDTO } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { UserRoles } from '@src/user/entity/user.entity';
import { ForbiddenException, Logger } from '@nestjs/common';
import { TextService } from '@src/text/text.service';
import { UserService } from '@src/user/user.service';
import { mockTextService } from '@src/text/text.controller.spec';

export const mockChatDTO: ChatDTO[] = [
  {
    id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId1: mockedUsersEntity[0].id,
    userId2: mockedUsersEntity[1].id,
    createdTime: undefined,
  },
  {
    id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId1: mockedUsersEntity[0].id,
    userId2: mockedUsersEntity[1].id,
    createdTime: undefined,
  },
]

export const mockChatEntity: ChatEntity[] = [
  {
    id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId1: mockedUsersEntity[0].id,
    userId2: mockedUsersEntity[1].id,
    createdTime: undefined,
    user1: mockedUsersEntity[0],
    user2: mockedUsersEntity[1],
    texts: []
  },
  {

    id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId1: mockedUsersEntity[0].id,
    userId2: mockedUsersEntity[1].id,
    createdTime: undefined,
    user1: mockedUsersEntity[0],
    user2: mockedUsersEntity[1],
    texts: []
  },
];

export const mockChatService = {
  findChatById: jest.fn().mockResolvedValue(mockChatEntity[0]),
  createChat: jest.fn().mockResolvedValue(mockChatEntity),
  updateChat: jest.fn().mockResolvedValue(mockChatEntity),
  deleteChat: jest.fn().mockResolvedValue(mockChatEntity),
  isOwnOrAdmin: jest.fn().mockReturnValue(true || false),
};

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;
  let userService: UserService;
  let textService: TextService;
  const mockChatId: string = '123456789';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        ChatService,
        Logger,
        {
          provide: UserService,
          useValue: mockUsersService,
        },
        {
          provide: TextService,
          useValue: mockTextService,
        },
      ],
    })
      .overrideProvider(ChatService)
      .useValue(mockChatService)
      .compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
    userService = module.get<UserService>(UserService);
    textService = module.get<TextService>(TextService);
  });

  // it('should be defined', () => {
  //   expect(chatController).toBeDefined();
  // });

  describe('findChatById', () => {
    it('should be return a chat', async () => {
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      await chatController.findChatById(mockResponse, mockRequest, mockChatId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(
        ChatEntity.parserChatEntityToDTO(mockChatEntity[0])
      );
    });

    it('should be return Incorrect data.', async () => {
      await chatController.findChatById(mockResponse, mockRequest, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should be return Not found.', async () => {
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(null);

      await chatController.findChatById(mockResponse, mockRequest, '123456789234567');

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should be return You don`t have permission.', async () => {
      const request = { user: 'incorrent-user-id' }
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      await chatController.findChatById(mockResponse, request, mockChatId);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith(`You don't have permission.`);
    });

    it('should handle errors and return a 500 status', async () => {
      jest.spyOn(chatService, 'findChatById').mockRejectedValue(new Error('Unexpected error'));

      await chatController.findChatById(mockResponse, mockRequest, mockChatId);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
    });
  });

  describe('createChat', () => {
    it('should be return a created chat.', async () => {
      const mockNewChat = { userId1: 'user1', userId2: 'user2' };
      const mockCreatedChat = { id: 'chat1', ...mockNewChat };
      const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(userService, 'areUsersExists').mockResolvedValue(true);
      jest.spyOn(chatService, 'createChat').mockResolvedValue(mockChatEntity[0]);

      await chatController.createChat(mockResponse, mockNewChat);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(
        ChatEntity.parserChatEntityToDTO(mockChatEntity[0])
      );
    });

    it('should return Incorrect data.', async () => {
      await chatController.createChat(mockResponse, null);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return Not found.', async () => {
      const mockChat = { userId1: 'user1', userId2: 'user2' };
      const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(userService, 'areUsersExists').mockResolvedValue(false);

      await chatController.createChat(mockResponse, mockChat);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should return Something went wrong.', async () => {
      const mockChat = { userId1: 'user1', userId2: 'user2' };
      const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(userService, 'areUsersExists').mockRejectedValue(new Error('Unexpected error'));

      await chatController.createChat(mockResponse, mockChat);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
    });
  });

  describe('updateChat', () => {
    it('should return an updated chat', async () => {
      const mockChat = { userId1: 'user1', userId2: 'user2' };
      const updatedChat = { ...mockChatEntity[0], ...mockChat };

      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      jest.spyOn(userService, 'areUsersExists').mockResolvedValue(true);
      jest.spyOn(chatService, 'updateChat').mockResolvedValue(updatedChat);

      await chatController.updateChat(mockResponse, mockRequest, mockChatId, mockChatDTO[0]);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(
        ChatEntity.parserChatPublicEntityToDTO(updatedChat)
      );
    });

    it('should return "Incorrect data." when chat data is not provided', async () => {
      await chatController.updateChat(mockResponse, mockRequest, mockChatId, null);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return "Not found." when chat is not found by ID', async () => {
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(null);

      await chatController.updateChat(mockResponse, mockRequest, mockChatId, mockChatDTO[0]);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should return "Not found." when users do not exist', async () => {
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      jest.spyOn(userService, 'areUsersExists').mockResolvedValue(false);

      await chatController.updateChat(mockResponse, mockRequest, mockChatId, mockChatDTO[0]);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should return a 500 error when something goes wrong', async () => {
      jest.spyOn(chatService, 'findChatById').mockRejectedValue(new Error('Unexpected error'));

      await chatController.updateChat(mockResponse, mockRequest, mockChatId, mockChatDTO[0]);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
    });

  });

  describe('deleteChat', () => {
    it('should return a deleted chat.', async () => {
      const mockChatId = 'mock-chat-id';
      const mockChat = { id: mockChatId, userId1: 'user1', userId2: 'user2', texts: [] };

      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      jest.spyOn(textService, 'deleteText').mockResolvedValue(null);
      jest.spyOn(chatService, 'deleteChat').mockResolvedValue(1);

      await chatController.deleteById(mockResponse, mockRequest, mockChatId);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(ChatEntity.parserChatEntityToDTO(mockChatEntity[0]));
    });

    it('should return Not found.', async () => {
      const mockChatId = 'non-existent-chat-id';

      jest.spyOn(chatService, 'findChatById').mockResolvedValue(null);

      await chatController.deleteById(mockResponse, mockRequest, mockChatId);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should return Not Delete.', async () => {
      const mockChatId = 'mock-chat-id';
      const mockChat = { id: mockChatId, userId1: 'user1', userId2: 'user2', texts: [] };

      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      jest.spyOn(textService, 'deleteText').mockResolvedValue(null);
      jest.spyOn(chatService, 'deleteChat').mockResolvedValue(0);

      await chatController.deleteById(mockResponse, mockRequest, mockChatId);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not Delete.');
    });

  });
});
