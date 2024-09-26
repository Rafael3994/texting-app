"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chat_service_1 = require("./chat.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entity/chat.entity");
const chat_controller_spec_1 = require("./chat.controller.spec");
const user_service_spec_1 = require("../user/user.service.spec");
const webSockets_gateway_1 = require("../web-sockets/webSockets.gateway");
describe('ChatService', () => {
    let service;
    let chatRepository;
    const mockChatId = '123456789';
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                chat_service_1.ChatService,
                common_1.Logger,
                webSockets_gateway_1.WebSocketsGateway,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(chat_entity_1.ChatEntity),
                    useValue: (0, user_service_spec_1.mockRepository)(),
                }
            ],
        }).compile();
        service = module.get(chat_service_1.ChatService);
        chatRepository = module.get((0, typeorm_1.getRepositoryToken)(chat_entity_1.ChatEntity));
    });
    describe('findChatById', () => {
        it('should be return a chat.', async () => {
            try {
                jest.spyOn(chatRepository, 'findOne').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
                const user = await service.findChatById(mockChatId);
                expect(chat_controller_spec_1.mockChatEntity[0]).toEqual(user);
            }
            catch (error) { }
        });
        it('should be return BadRequestException.', async () => {
            try {
                await service.findChatById('');
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.BadRequestException);
            }
        });
    });
    describe('findAll', () => {
        it('should be return chats.', async () => {
            try {
                jest.spyOn(chatRepository, 'find').mockResolvedValue(chat_controller_spec_1.mockChatEntity);
                const users = await service.findAll();
                expect(users).toEqual(chat_controller_spec_1.mockChatEntity);
            }
            catch (error) { }
        });
    });
    describe('createChat', () => {
        it('should be return the created chat', async () => {
            try {
                const newChat = {
                    userId1: mockChatId,
                    userId2: mockChatId,
                };
                jest.spyOn(chatRepository, 'save').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
                const newChatCreated = await service.createChat(newChat);
                expect(newChatCreated).toBe(chat_controller_spec_1.mockChatEntity[0]);
            }
            catch (error) { }
        });
        it('should be return BadRequestException', async () => {
            try {
                await service.createChat(undefined);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.BadRequestException);
            }
        });
    });
    describe('updateChat', () => {
        it('should be return the updated chat.', async () => {
            try {
                const newChat = {
                    userId1: mockChatId,
                    userId2: mockChatId,
                };
                jest.spyOn(chatRepository, 'save').mockResolvedValue(chat_controller_spec_1.mockChatEntity[0]);
                const updatedChat = await service.updateChat(newChat);
                expect(updatedChat).toBe(chat_controller_spec_1.mockChatEntity[0]);
            }
            catch (error) { }
        });
        it('should be return BadRequestException.', async () => {
            try {
                await service.updateChat(undefined);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.BadRequestException);
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
            }
            catch (error) { }
        });
        it('should be return BadRequestException.', async () => {
            try {
                await service.deleteChat(undefined);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.BadRequestException);
            }
        });
    });
});
//# sourceMappingURL=chat.service.spec.js.map