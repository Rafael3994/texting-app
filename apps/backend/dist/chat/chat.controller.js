"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const chat_dto_1 = require("./dto/chat.dto");
const chat_service_1 = require("./chat.service");
const chat_entity_1 = require("./entity/chat.entity");
const user_service_1 = require("../user/user.service");
const classificatedHttpCode_1 = require("../utils/classificatedHttpCode");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const isOwnOrAdmin_1 = require("../utils/isOwnOrAdmin");
const text_service_1 = require("../text/text.service");
const swagger_1 = require("@nestjs/swagger");
const chat_create_dto_1 = require("./dto/chat.create.dto");
const isOwn_1 = require("../utils/isOwn");
const user_entity_1 = require("../user/entity/user.entity");
const webSockets_gateway_1 = require("../web-sockets/webSockets.gateway");
let ChatController = class ChatController {
    constructor(chatService, userService, textService, logger, webSocketsGateway) {
        this.chatService = chatService;
        this.userService = userService;
        this.textService = textService;
        this.logger = logger;
        this.webSocketsGateway = webSocketsGateway;
    }
    async findChatById(response, request, chatId) {
        try {
            if (!chatId)
                return response.status(400).send('Incorrect data.');
            const chat = await this.chatService.findChatById(chatId, ['user1', 'user2', 'texts']);
            if ((0, classificatedHttpCode_1.isNotFound)(chat))
                return response.status(404).send('Not found.');
            if (!(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, chat.userId1) &&
                !(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, chat.userId2)) {
                return response.status(401).send(`You don't have permission.`);
            }
            return response.status(200).send(chat_entity_1.ChatEntity.parserChatEntityToDTO(chat));
        }
        catch (err) {
            this.logger.error('findChatById', err);
            return response.status(500).send('Something went wrong.');
        }
    }
    async findAllChatByUserId(response, request, userId) {
        try {
            if (!userId)
                return response.status(400).send('Incorrect data.');
            const userFound = await this.userService.findUserById(userId);
            if ((0, classificatedHttpCode_1.isNotFound)(userFound))
                return response.status(404).send('Not found.');
            if (!(0, isOwn_1.isOwn)(request.user.id, userFound.id) && request.user.role !== user_entity_1.UserRoles.ADMIN) {
                return response.status(401).send(`You don't have permission.`);
            }
            const allChats = await this.chatService.findAllChatByUserId(userId);
            if ((0, classificatedHttpCode_1.isNotFound)(allChats)) {
                return response.status(204).send([]);
            }
            return response.status(200).send(allChats.map(chat => {
                return chat_entity_1.ChatEntity.parserChatEntityToDTO(chat);
            }));
        }
        catch (err) {
            this.logger.error('findChatById', err);
            return response.status(500).send('Something went wrong.');
        }
    }
    async createChat(response, chat) {
        try {
            if (!chat) {
                return response.status(400).send('Incorrect data.');
            }
            const usersExist = await this.userService.areUsersExists(chat.userId1, chat.userId2);
            if (!usersExist) {
                return response.status(404).send('Not found.');
            }
            const createdChat = await this.chatService.createChat(chat);
            const findNewChat = await this.chatService.findChatById(createdChat.id, ['user1', 'user2']);
            const createdChatDto = chat_entity_1.ChatEntity.parserChatEntityToDTO(findNewChat);
            this.webSocketsGateway.handleCreateChat(findNewChat);
            return response
                .status(201)
                .send(createdChatDto);
        }
        catch (err) {
            this.logger.error('createChat', err);
            return response.status(500).send('Something went wrong.');
        }
    }
    async updateChat(response, request, id, chat) {
        try {
            if (!chat) {
                return response.status(400).send('Incorrect data.');
            }
            const foundChat = await this.chatService.findChatById(id);
            if (!foundChat) {
                return response.status(404).send('Not found.');
            }
            if (!(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, foundChat.userId1) &&
                !(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, foundChat.userId2)) {
                throw new common_1.ForbiddenException('You do not have permission to access this resource');
            }
            const usersExist = await this.userService.areUsersExists(chat.userId1, chat.userId2);
            if (!usersExist) {
                return response.status(404).send('Not found.');
            }
            const updatedChatData = Object.assign(Object.assign({}, chat_entity_1.ChatEntity.parserChatEntityToDTO(foundChat)), chat);
            const updatedChat = await this.chatService.updateChat(updatedChatData);
            return response.status(201).send(chat_entity_1.ChatEntity.parserChatPublicEntityToDTO(updatedChat));
        }
        catch (err) {
            this.logger.error('createChat', err);
            return response.status(500).send('Something went wrong.');
        }
    }
    async deleteById(response, request, id) {
        try {
            const foundChat = await this.chatService.findChatById(id, ['texts']);
            if (!foundChat) {
                return response.status(404).send('Not found.');
            }
            if (!(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, foundChat.userId1) &&
                !(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, foundChat.userId2)) {
                return response.status(403).send({
                    statusCode: 403,
                    message: 'You do not have permission to access this resource',
                });
            }
            for (const text of foundChat.texts) {
                await this.textService.deleteText(text.id);
            }
            const deleteResult = await this.chatService.deleteChat(id);
            if (deleteResult > 0) {
                this.webSocketsGateway.handleDeleteChat(foundChat);
                return response.status(200).send(chat_entity_1.ChatEntity.parserChatEntityToDTO(foundChat));
            }
            else {
                return response.status(404).send('Not Delete.');
            }
        }
        catch (error) {
            this.logger.error('deleteById', error);
            return response.status(500).send('Something went wrong.');
        }
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get a chat.',
        description: 'This endpoint is enabled for the users participants of the chat and users with role admin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the chat found.',
        type: (0, swagger_1.PickType)(chat_dto_1.ChatDTO, ['user1', 'user2', 'texts']),
    }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findChatById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all chats from a user.',
        description: 'This endpoint is enabled for the user logged and users with role admin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns all chats found.',
        type: (0, swagger_1.PickType)(chat_dto_1.ChatDTO, ['user1', 'user2', 'texts']),
        isArray: true,
    }),
    (0, common_1.Get)('user/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findAllChatByUserId", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a chat.',
        description: 'Create a chat.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the created chat.',
        type: (0, swagger_1.PickType)(chat_dto_1.ChatDTO, ['user1', 'user2']),
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)('')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chat_create_dto_1.ChatCreateDTO]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChat", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update chat.',
        description: 'Only for the admin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the updated chat.',
        type: (0, swagger_1.PickType)(chat_dto_1.ChatDTO, ['user1', 'user2', 'texts']),
    }),
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, chat_create_dto_1.ChatCreateDTO]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateChat", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a chat.',
        description: 'This endpoint is enabled for the users participants of the chat and users with role admin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the deleted chat.',
        type: (0, swagger_1.PickType)(chat_dto_1.ChatDTO, ['user1', 'user2', 'texts']),
    }),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteById", null);
ChatController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('CHAT'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_service_1.UserService,
        text_service_1.TextService,
        common_1.Logger,
        webSockets_gateway_1.WebSocketsGateway])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map