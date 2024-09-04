import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from './text.controller';
import { Logger } from '@nestjs/common';
import { mockChatService } from '@src/chat/chat.controller.spec';
import { ChatService } from '@src/chat/chat.service';
import { UserService } from '@src/user/user.service';
import { TextService } from './text.service';


export const mockTextService = {
  findAllUsers: () => '',
  findUserById: () => '',
  createUser: () => '',
  updateUser: () => '',
  deleteUser: () => '',
  deleteText: () => undefined,
};

describe('TextController', () => {
  let textController: TextController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
      providers: [
        {
          provide: TextService,
          useValue: mockTextService,
        },
        {
          provide: UserService,
          useValue: mockTextService,
        },
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        Logger,
      ],
    })
      .compile();

    textController = module.get<TextController>(TextController);

  });

  it('should be defined', () => {
    expect(textController).toBeDefined();
  });
}); 
