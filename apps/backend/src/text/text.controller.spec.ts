import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from './text.controller';
import { Logger } from '@nestjs/common';
import { mockChatDTO, mockChatEntity, mockChatService } from '@src/chat/chat.controller.spec';
import { ChatService } from '@src/chat/chat.service';
import { UserService } from '@src/user/user.service';
import { TextService } from './text.service';
import { TextEntity } from './entity/text.entity';
import { mockedUsersDTO, mockedUsersEntity, mockedUsersPublicDTO, mockRequest, mockResponse, mockUsersService as mockUserService } from '@src/user/user.controller.spec';
import { TextDTO } from './dto/text.dto';
import { isOwnOrAdmin } from '@src/utils/isOwnOrAdmin';
import { TextCreateDTO } from './dto/text.create.dto';
import { WebSocketsGateway } from '@src/web-sockets/webSockets.gateway';

export const mockTextEntity: TextEntity[] = [
  {
    id: '2ab8cd0f9f68ab64bdaf9cf9e626a',
    chatId: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId: mockedUsersEntity[1].id,
    text: 'lorem lorem lorem',
    createdTime: undefined,
    chat: {
      id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
      userId1: mockedUsersEntity[0].id,
      userId2: mockedUsersEntity[1].id,
      createdTime: undefined,
      user1: mockedUsersEntity[0],
      user2: mockedUsersEntity[1],
      texts: []
    },
    user: mockedUsersEntity[0]
  }
];

export const mockTextDTO: TextDTO[] = [
  {
    id: '2ab8cd0f9f68ab64bdaf9cf9e626a',
    chatId: 'f1200e0e-080d-4f28-ace1-aae1c73af2a0',
    userId: mockedUsersDTO[1].id,
    text: 'lorem lorem lorem',
    createdTime: undefined,
    chat: {
      id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
      userId1: mockedUsersEntity[0].id,
      userId2: mockedUsersEntity[1].id,
      createdTime: undefined,
    },
    user: mockedUsersPublicDTO[0]
  }
];

export const mockTextCreateDTO: TextCreateDTO = {
  chatId: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
  userId: mockedUsersDTO[1].id,
  text: 'lorem lorem lorem',
}

export const mockTextService = {
  deleteText: () => 1 || 0,
  findTextById: () => mockTextEntity[0],
  createText: () => mockTextEntity[0],
  updateText: () => mockTextEntity[0],
};

describe('TextController', () => {
  let textController: TextController;
  let textService: TextService;
  let chatService: ChatService;
  const mockTextId: string = '2ab8cd0f9f68ab64bdaf9cf9e626a';

  beforeEach(async () => {
    // jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
      providers: [
        {
          provide: TextService,
          useValue: mockTextService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        Logger,
        WebSocketsGateway,
      ],
    })
      .compile();

    textController = module.get<TextController>(TextController);
    textService = module.get<TextService>(TextService);
    chatService = module.get<ChatService>(ChatService);
  });

  // it('should be defined', () => {
  //   expect(textController).toBeDefined();
  // });

  describe('findTextById', () => {
    it('should be return a text', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(mockTextEntity[0]);

      await textController.findTextById(mockResponse, mockRequest, mockTextId);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(
        TextEntity.parserTextEntityToDTO(mockTextEntity[0])
      );
    });

    it('should return 400 if no ID is provided', async () => {
      await textController.findTextById(mockResponse, mockRequest, '');

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return 404 if text is not found', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(null);

      await textController.findTextById(mockResponse, mockRequest, 'validId');

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(textService, 'findTextById').mockRejectedValue(new Error('Database error'));

      await textController.findTextById(mockResponse, mockRequest, 'validId');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
    });
  });

  describe('createText', () => {
    it('should return 400 if the text is not sanitized', async () => {
      jest.spyOn(textController, 'isSanitedText').mockReturnValue(false);

      await textController.createText(mockResponse, mockRequest, mockTextCreateDTO);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return 404 if userId or chatId does not exist', async () => {
      jest.spyOn(textController, 'isSanitedText').mockReturnValue(true);
      jest.spyOn(textController, 'areIdsExists').mockResolvedValue(false);

      await textController.createText(mockResponse, mockRequest, mockTextCreateDTO);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Data ids Not found.');
    });

    it('should return 401 if the user does not have permission', async () => {
      jest.spyOn(textController, 'isSanitedText').mockReturnValue(true);
      jest.spyOn(textController, 'areIdsExists').mockResolvedValue(true);
      const mockRequest = { user: { id: '123456789' } }
      await textController.createText(mockResponse, mockRequest, mockTextCreateDTO);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith(`You don't have permission.`);
    });

    it('should return 201 and the created text if successful', async () => {
      jest.spyOn(textController, 'isSanitedText').mockReturnValue(true);
      jest.spyOn(textController, 'areIdsExists').mockResolvedValue(true);

      jest.spyOn(textService, 'createText').mockResolvedValue(mockTextEntity[0]);

      await textController.createText(mockResponse, mockRequest, mockTextCreateDTO);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(TextEntity.parserTextEntityToDTO(mockTextEntity[0]));
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(textController, 'isSanitedText').mockReturnValue(true);
      jest.spyOn(textController, 'areIdsExists').mockResolvedValue(true);

      jest.spyOn(textService, 'createText').mockRejectedValue(new Error('Database error'));

      await textController.createText(mockResponse, mockRequest, mockTextCreateDTO);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
    });
  });

  describe('updateText', () => {
    it('should return 400 if no text is provided', async () => {
      await textController.updateText(mockResponse, mockRequest, mockTextId, '');

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return 404 if the text is not found', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(null);

      await textController.updateText(mockResponse, mockRequest, mockTextId, 'new-text');

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should return 401 if the user does not have permission', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(mockTextEntity[0]);
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);

      const mockRequest = { user: { id: '2345678' } }
      await textController.updateText(mockResponse, mockRequest, mockTextId, 'new-text');

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith(`You don't have permission.`);
    });

    it('should return 200 and the updated text if successful', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(mockTextEntity[0]);
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);

      jest.spyOn(textService, 'updateText').mockResolvedValue(mockTextEntity[0]);

      await textController.updateText(mockResponse, mockRequest, mockTextId, 'new-text');

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(TextEntity.parserTextPublicEntityToDTO(mockTextEntity[0]));
    });

    it('should return 500 if an error occurs during update', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(mockTextEntity[0]);
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      jest.spyOn(textService, 'updateText').mockRejectedValue(new Error('Database error'));

      await textController.updateText(mockResponse, mockRequest, mockTextId, 'new-text');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Error: Database error');
    });
  });

  describe('deleteText', () => {
    it('should return 400 if no id is provided', async () => {
      await textController.deleteText(mockResponse, mockRequest, '');

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
    });

    it('should return 404 if the text is not found', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(null);

      await textController.deleteText(mockResponse, mockRequest, mockTextId);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not found.');
    });

    it('should return 401 if the user does not have permission', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(mockTextEntity[0]);
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);

      const mockRequest = { user: { id: '123456789' } };
      await textController.deleteText(mockResponse, mockRequest, mockTextId);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith(`You don't have permission.`);
    });

    it('should return 200 and the deleted text if successfully deleted', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(mockTextEntity[0]);
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      jest.spyOn(textService, 'deleteText').mockResolvedValue(1);

      await textController.deleteText(mockResponse, mockRequest, mockTextId);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(TextEntity.parserTextPublicEntityToDTO(mockTextEntity[0]));
    });

    it('should return 404 if the text could not be deleted', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(mockTextEntity[0]);
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      jest.spyOn(textService, 'deleteText').mockResolvedValue(0);

      await textController.deleteText(mockResponse, mockRequest, mockTextId);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not Deleted.');
    });

    it('should return 500 if an error occurs during deletion', async () => {
      jest.spyOn(textService, 'findTextById').mockResolvedValue(mockTextEntity[0]);
      jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockChatEntity[0]);
      jest.spyOn(textService, 'deleteText').mockRejectedValue(new Error('Database error'));

      await textController.deleteText(mockResponse, mockRequest, mockTextId);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Error: Database error');
    });
  });
}); 
