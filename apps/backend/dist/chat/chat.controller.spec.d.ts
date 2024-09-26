/// <reference types="jest" />
import { ChatEntity } from './entity/chat.entity';
import { ChatDTO } from './dto/chat.dto';
export declare const mockChatDTO: ChatDTO[];
export declare const mockChatEntity: ChatEntity[];
export declare const mockChatService: {
    findChatById: jest.Mock<any, any>;
    createChat: jest.Mock<any, any>;
    updateChat: jest.Mock<any, any>;
    deleteChat: jest.Mock<any, any>;
    isOwnOrAdmin: jest.Mock<any, any>;
};
