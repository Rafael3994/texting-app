"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockChatService = exports.mockChatEntity = exports.mockChatDTO = void 0;
const testing_1 = require("@nestjs/testing");
const chat_controller_1 = require("./chat.controller");
const chat_entity_1 = require("./entity/chat.entity");
const user_controller_spec_1 = require("../user/user.controller.spec");
const chat_service_1 = require("./chat.service");
const user_entity_1 = require("../user/entity/user.entity");
const common_1 = require("@nestjs/common");
const text_service_1 = require("../text/text.service");
const user_service_1 = require("../user/user.service");
const text_controller_spec_1 = require("../text/text.controller.spec");
const webSockets_gateway_1 = require("../web-sockets/webSockets.gateway");
exports.mockChatDTO = [
    {
        id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
        userId1: user_controller_spec_1.mockedUsersEntity[0].id,
        userId2: user_controller_spec_1.mockedUsersEntity[1].id,
        createdTime: undefined,
    },
    {
        id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
        userId1: user_controller_spec_1.mockedUsersEntity[0].id,
        userId2: user_controller_spec_1.mockedUsersEntity[1].id,
        createdTime: undefined,
    },
];
exports.mockChatEntity = [
    {
        id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
        userId1: user_controller_spec_1.mockedUsersEntity[0].id,
        userId2: user_controller_spec_1.mockedUsersEntity[1].id,
        createdTime: undefined,
        user1: user_controller_spec_1.mockedUsersEntity[0],
        user2: user_controller_spec_1.mockedUsersEntity[1],
        texts: []
    },
    {
        id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
        userId1: user_controller_spec_1.mockedUsersEntity[0].id,
        userId2: user_controller_spec_1.mockedUsersEntity[1].id,
        createdTime: undefined,
        user1: user_controller_spec_1.mockedUsersEntity[0],
        user2: user_controller_spec_1.mockedUsersEntity[1],
        texts: []
    },
];
exports.mockChatService = {
    findChatById: jest.fn().mockResolvedValue(exports.mockChatEntity[0]),
    createChat: jest.fn().mockResolvedValue(exports.mockChatEntity),
    updateChat: jest.fn().mockResolvedValue(exports.mockChatEntity),
    deleteChat: jest.fn().mockResolvedValue(exports.mockChatEntity),
    isOwnOrAdmin: jest.fn().mockReturnValue(true || false),
};
describe('ChatController', () => {
    let chatController;
    let chatService;
    let userService;
    let textService;
    const mockChatId = '123456789';
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [chat_controller_1.ChatController],
            providers: [
                chat_service_1.ChatService,
                common_1.Logger,
                webSockets_gateway_1.WebSocketsGateway,
                {
                    provide: user_service_1.UserService,
                    useValue: user_controller_spec_1.mockUsersService,
                },
                {
                    provide: text_service_1.TextService,
                    useValue: text_controller_spec_1.mockTextService,
                },
            ],
        })
            .overrideProvider(chat_service_1.ChatService)
            .useValue(exports.mockChatService)
            .compile();
        chatController = module.get(chat_controller_1.ChatController);
        chatService = module.get(chat_service_1.ChatService);
        userService = module.get(user_service_1.UserService);
        textService = module.get(text_service_1.TextService);
    });
    describe('findChatById', () => {
        it('should be return a chat', async () => {
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(exports.mockChatEntity[0]);
            await chatController.findChatById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(200);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(chat_entity_1.ChatEntity.parserChatEntityToDTO(exports.mockChatEntity[0]));
        });
        it('should be return Incorrect data.', async () => {
            await chatController.findChatById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, undefined);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(400);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should be return Not found.', async () => {
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(null);
            await chatController.findChatById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, '123456789234567');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should be return You don`t have permission.', async () => {
            const request = { user: 'incorrent-user-id' };
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(exports.mockChatEntity[0]);
            await chatController.findChatById(user_controller_spec_1.mockResponse, request, mockChatId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(401);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(`You don't have permission.`);
        });
        it('should handle errors and return a 500 status', async () => {
            jest.spyOn(chatService, 'findChatById').mockRejectedValue(new Error('Unexpected error'));
            await chatController.findChatById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(500);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
        });
    });
    describe('createChat', () => {
        it('should return a created chat.', async () => {
            const mockNewChat = {
                userId1: '09398f56-93e4-4a2f-96e8-342683f7d35a',
                userId2: '0e2431eb-a822-4e34-aad1-490721012e87',
            };
            const mockCreateChat = {
                userId1: '09398f56-93e4-4a2f-96e8-342683f7d35a',
                userId2: '0e2431eb-a822-4e34-aad1-490721012e87',
                id: '48c158d6-0beb-4095-a755-e99d4f1c3929',
                createdTime: undefined,
                user1: undefined,
                user2: undefined,
                texts: []
            };
            const mockfindChatById = {
                id: '48c158d6-0beb-4095-a755-e99d4f1c3929',
                userId1: '09398f56-93e4-4a2f-96e8-342683f7d35a',
                userId2: '0e2431eb-a822-4e34-aad1-490721012e87',
                createdTime: undefined,
                texts: [],
                user1: {
                    id: '09398f56-93e4-4a2f-96e8-342683f7d35a',
                    name: 'user1',
                    email: 'user1@gmail.com',
                    password: '$2b$08$zYfB.m7VNCwFtqG4amUc0O9AiYfWD2ZutgBlLv7F5gmWI4BH.azJy',
                    role: user_entity_1.UserRoles.USER,
                    createdTime: undefined,
                    chatsAsUser1: [],
                    chatsAsUser2: [],
                    texts: []
                },
                user2: {
                    id: '0e2431eb-a822-4e34-aad1-490721012e87',
                    name: 'user2',
                    email: 'user2@gmail.com',
                    password: '$2b$08$y8lyR4IHnkmjyluG8NAsAe043THzSxZJI9KM/nW76ka7L.ruQEIH6',
                    role: user_entity_1.UserRoles.USER,
                    createdTime: undefined,
                    chatsAsUser1: [],
                    chatsAsUser2: [],
                    texts: []
                }
            };
            const mocktest = {
                id: '6970ac2a-9384-4273-b3db-d7d786590b34',
                userId1: '09398f56-93e4-4a2f-96e8-342683f7d35a',
                userId2: '0e2431eb-a822-4e34-aad1-490721012e87',
                createdTime: undefined,
                user1: { name: 'user1', email: 'user1@gmail.com' },
                user2: { name: 'user2', email: 'user2@gmail.com' },
                texts: undefined
            };
            jest.spyOn(userService, 'areUsersExists').mockResolvedValue(true);
            jest.spyOn(chatService, 'createChat').mockResolvedValue(mockCreateChat);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(mockfindChatById);
            jest.spyOn(chat_entity_1.ChatEntity, 'parserChatEntityToDTO').mockReturnValue(mocktest);
            await chatController.createChat(user_controller_spec_1.mockResponse, mockNewChat);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(201);
        });
        it('should return Incorrect data.', async () => {
            await chatController.createChat(user_controller_spec_1.mockResponse, null);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(400);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
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
            const updatedChat = Object.assign(Object.assign({}, exports.mockChatEntity[0]), mockChat);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(exports.mockChatEntity[0]);
            jest.spyOn(userService, 'areUsersExists').mockResolvedValue(true);
            jest.spyOn(chatService, 'updateChat').mockResolvedValue(updatedChat);
            await chatController.updateChat(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId, exports.mockChatDTO[0]);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(201);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(chat_entity_1.ChatEntity.parserChatPublicEntityToDTO(updatedChat));
        });
        it('should return "Incorrect data." when chat data is not provided', async () => {
            await chatController.updateChat(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId, null);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(400);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return "Not found." when chat is not found by ID', async () => {
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(null);
            await chatController.updateChat(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId, exports.mockChatDTO[0]);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should return "Not found." when users do not exist', async () => {
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(exports.mockChatEntity[0]);
            jest.spyOn(userService, 'areUsersExists').mockResolvedValue(false);
            await chatController.updateChat(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId, exports.mockChatDTO[0]);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should return a 500 error when something goes wrong', async () => {
            jest.spyOn(chatService, 'findChatById').mockRejectedValue(new Error('Unexpected error'));
            await chatController.updateChat(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId, exports.mockChatDTO[0]);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(500);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
        });
    });
    describe('deleteChat', () => {
        it('should return a deleted chat.', async () => {
            const mockChatId = 'mock-chat-id';
            const mockChat = { id: mockChatId, userId1: 'user1', userId2: 'user2', texts: [] };
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(exports.mockChatEntity[0]);
            jest.spyOn(textService, 'deleteText').mockResolvedValue(null);
            jest.spyOn(chatService, 'deleteChat').mockResolvedValue(1);
            await chatController.deleteById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(200);
        });
        it('should return Not found.', async () => {
            const mockChatId = 'non-existent-chat-id';
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(null);
            await chatController.deleteById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should return Not Delete.', async () => {
            const mockChatId = 'mock-chat-id';
            const mockChat = { id: mockChatId, userId1: 'user1', userId2: 'user2', texts: [] };
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(exports.mockChatEntity[0]);
            jest.spyOn(textService, 'deleteText').mockResolvedValue(null);
            jest.spyOn(chatService, 'deleteChat').mockResolvedValue(0);
            await chatController.deleteById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockChatId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not Delete.');
        });
    });
});
//# sourceMappingURL=chat.controller.spec.js.map