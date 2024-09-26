"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockTextService = exports.mockTextCreateDTO = exports.mockTextDTO = exports.mockTextEntity = void 0;
const testing_1 = require("@nestjs/testing");
const text_controller_1 = require("./text.controller");
const common_1 = require("@nestjs/common");
const chat_controller_spec_1 = require("../chat/chat.controller.spec");
const chat_service_1 = require("../chat/chat.service");
const user_service_1 = require("../user/user.service");
const text_service_1 = require("./text.service");
const text_entity_1 = require("./entity/text.entity");
const user_controller_spec_1 = require("../user/user.controller.spec");
const webSockets_gateway_1 = require("../web-sockets/webSockets.gateway");
exports.mockTextEntity = [
    {
        id: '2ab8cd0f9f68ab64bdaf9cf9e626a',
        chatId: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
        userId: user_controller_spec_1.mockedUsersEntity[1].id,
        text: 'lorem lorem lorem',
        createdTime: undefined,
        chat: {
            id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
            userId1: user_controller_spec_1.mockedUsersEntity[0].id,
            userId2: user_controller_spec_1.mockedUsersEntity[1].id,
            createdTime: undefined,
            user1: user_controller_spec_1.mockedUsersEntity[0],
            user2: user_controller_spec_1.mockedUsersEntity[1],
            texts: []
        },
        user: user_controller_spec_1.mockedUsersEntity[0]
    }
];
exports.mockTextDTO = [
    {
        id: '2ab8cd0f9f68ab64bdaf9cf9e626a',
        chatId: 'f1200e0e-080d-4f28-ace1-aae1c73af2a0',
        userId: user_controller_spec_1.mockedUsersDTO[1].id,
        text: 'lorem lorem lorem',
        createdTime: undefined,
        chat: {
            id: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
            userId1: user_controller_spec_1.mockedUsersEntity[0].id,
            userId2: user_controller_spec_1.mockedUsersEntity[1].id,
            createdTime: undefined,
        },
        user: user_controller_spec_1.mockedUsersPublicDTO[0]
    }
];
exports.mockTextCreateDTO = {
    chatId: "f1200e0e-080d-4f28-ace1-aae1c73af2a0",
    userId: user_controller_spec_1.mockedUsersDTO[1].id,
    text: 'lorem lorem lorem',
};
exports.mockTextService = {
    deleteText: () => 1 || 0,
    findTextById: () => exports.mockTextEntity[0],
    createText: () => exports.mockTextEntity[0],
    updateText: () => exports.mockTextEntity[0],
};
describe('TextController', () => {
    let textController;
    let textService;
    let chatService;
    const mockTextId = '2ab8cd0f9f68ab64bdaf9cf9e626a';
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [text_controller_1.TextController],
            providers: [
                {
                    provide: text_service_1.TextService,
                    useValue: exports.mockTextService,
                },
                {
                    provide: user_service_1.UserService,
                    useValue: user_controller_spec_1.mockUsersService,
                },
                {
                    provide: chat_service_1.ChatService,
                    useValue: chat_controller_spec_1.mockChatService,
                },
                common_1.Logger,
                webSockets_gateway_1.WebSocketsGateway,
            ],
        })
            .compile();
        textController = module.get(text_controller_1.TextController);
        textService = module.get(text_service_1.TextService);
        chatService = module.get(chat_service_1.ChatService);
    });
    describe('findTextById', () => {
        it('should be return a text', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(exports.mockTextEntity[0]);
            await textController.findTextById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(200);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(text_entity_1.TextEntity.parserTextEntityToDTO(exports.mockTextEntity[0]));
        });
        it('should return 400 if no ID is provided', async () => {
            await textController.findTextById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, '');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(400);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return 404 if text is not found', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(null);
            await textController.findTextById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, 'validId');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should return 500 if an error occurs', async () => {
            jest.spyOn(textService, 'findTextById').mockRejectedValue(new Error('Database error'));
            await textController.findTextById(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, 'validId');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(500);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
        });
    });
    describe('createText', () => {
        it('should return 400 if the text is not sanitized', async () => {
            jest.spyOn(textController, 'isSanitedText').mockReturnValue(false);
            await textController.createText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, exports.mockTextCreateDTO);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(400);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return 404 if userId or chatId does not exist', async () => {
            jest.spyOn(textController, 'isSanitedText').mockReturnValue(true);
            jest.spyOn(textController, 'areIdsExists').mockResolvedValue(false);
            await textController.createText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, exports.mockTextCreateDTO);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Data ids Not found.');
        });
        it('should return 401 if the user does not have permission', async () => {
            jest.spyOn(textController, 'isSanitedText').mockReturnValue(true);
            jest.spyOn(textController, 'areIdsExists').mockResolvedValue(true);
            const mockRequest = { user: { id: '123456789' } };
            await textController.createText(user_controller_spec_1.mockResponse, mockRequest, exports.mockTextCreateDTO);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(401);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(`You don't have permission.`);
        });
        it('should return 201 and the created text if successful', async () => {
            jest.spyOn(textController, 'isSanitedText').mockReturnValue(true);
            jest.spyOn(textController, 'areIdsExists').mockResolvedValue(true);
            jest.spyOn(textService, 'createText').mockResolvedValue(exports.mockTextEntity[0]);
            await textController.createText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, exports.mockTextCreateDTO);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(201);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(text_entity_1.TextEntity.parserTextEntityToDTO(exports.mockTextEntity[0]));
        });
        it('should return 500 if an error occurs', async () => {
            jest.spyOn(textController, 'isSanitedText').mockReturnValue(true);
            jest.spyOn(textController, 'areIdsExists').mockResolvedValue(true);
            jest.spyOn(textService, 'createText').mockRejectedValue(new Error('Database error'));
            await textController.createText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, exports.mockTextCreateDTO);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(500);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
        });
    });
    describe('updateText', () => {
        it('should return 400 if no text is provided', async () => {
            await textController.updateText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId, '');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(400);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return 404 if the text is not found', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(null);
            await textController.updateText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId, 'new-text');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should return 401 if the user does not have permission', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(exports.mockTextEntity[0]);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
            const mockRequest = { user: { id: '2345678' } };
            await textController.updateText(user_controller_spec_1.mockResponse, mockRequest, mockTextId, 'new-text');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(401);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(`You don't have permission.`);
        });
        it('should return 200 and the updated text if successful', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(exports.mockTextEntity[0]);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
            jest.spyOn(textService, 'updateText').mockResolvedValue(exports.mockTextEntity[0]);
            await textController.updateText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId, 'new-text');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(200);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(text_entity_1.TextEntity.parserTextPublicEntityToDTO(exports.mockTextEntity[0]));
        });
        it('should return 500 if an error occurs during update', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(exports.mockTextEntity[0]);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
            jest.spyOn(textService, 'updateText').mockRejectedValue(new Error('Database error'));
            await textController.updateText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId, 'new-text');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(500);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Error: Database error');
        });
    });
    describe('deleteText', () => {
        it('should return 400 if no id is provided', async () => {
            await textController.deleteText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, '');
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(400);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return 404 if the text is not found', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(null);
            await textController.deleteText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should return 401 if the user does not have permission', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(exports.mockTextEntity[0]);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
            const mockRequest = { user: { id: '123456789' } };
            await textController.deleteText(user_controller_spec_1.mockResponse, mockRequest, mockTextId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(401);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(`You don't have permission.`);
        });
        it('should return 200 and the deleted text if successfully deleted', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(exports.mockTextEntity[0]);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
            jest.spyOn(textService, 'deleteText').mockResolvedValue(1);
            await textController.deleteText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(200);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith(text_entity_1.TextEntity.parserTextPublicEntityToDTO(exports.mockTextEntity[0]));
        });
        it('should return 404 if the text could not be deleted', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(exports.mockTextEntity[0]);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
            jest.spyOn(textService, 'deleteText').mockResolvedValue(0);
            await textController.deleteText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(404);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Not Deleted.');
        });
        it('should return 500 if an error occurs during deletion', async () => {
            jest.spyOn(textService, 'findTextById').mockResolvedValue(exports.mockTextEntity[0]);
            jest.spyOn(chatService, 'findChatById').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
            jest.spyOn(textService, 'deleteText').mockRejectedValue(new Error('Database error'));
            await textController.deleteText(user_controller_spec_1.mockResponse, user_controller_spec_1.mockRequest, mockTextId);
            expect(user_controller_spec_1.mockResponse.status).toHaveBeenCalledWith(500);
            expect(user_controller_spec_1.mockResponse.send).toHaveBeenCalledWith('Error: Database error');
        });
    });
});
//# sourceMappingURL=text.controller.spec.js.map