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
exports.TextController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const text_service_1 = require("./text.service");
const classificatedHttpCode_1 = require("../utils/classificatedHttpCode");
const text_entity_1 = require("./entity/text.entity");
const text_dto_1 = require("./dto/text.dto");
const user_service_1 = require("../user/user.service");
const chat_service_1 = require("../chat/chat.service");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const isOwnOrAdmin_1 = require("../utils/isOwnOrAdmin");
const isOwn_1 = require("../utils/isOwn");
const swagger_1 = require("@nestjs/swagger");
const text_public_dto_1 = require("./dto/text.public.dto");
const text_create_dto_1 = require("./dto/text.create.dto");
const webSockets_gateway_1 = require("../web-sockets/webSockets.gateway");
let TextController = class TextController {
    constructor(textService, userService, chatService, logger, webSocketsGateway) {
        this.textService = textService;
        this.userService = userService;
        this.chatService = chatService;
        this.logger = logger;
        this.webSocketsGateway = webSocketsGateway;
    }
    async findTextById(response, request, id) {
        try {
            if (!id) {
                return response.status(400).send('Incorrect data.');
            }
            const textEntity = await this.textService.findTextById(id);
            if ((0, classificatedHttpCode_1.isNotFound)(textEntity)) {
                return response.status(404).send('Not found.');
            }
            if (!(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, textEntity.userId)) {
                return response.status(401).send(`You don't have permission.`);
            }
            return response.status(200).send(text_entity_1.TextEntity.parserTextEntityToDTO(textEntity));
        }
        catch (error) {
            this.logger.error('findTextById', error);
            return response.status(500).send('Something went wrong.');
        }
    }
    async findAllTextByChatId(response, request, id) {
        try {
            if (!id) {
                return response.status(400).send('Incorrect data.');
            }
            const chatEntity = await this.chatService.findChatById(id);
            if ((0, classificatedHttpCode_1.isNotFound)(chatEntity)) {
                return response.status(404).send('Not found.');
            }
            if (!(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, chatEntity.userId1) &&
                !(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, chatEntity.userId2)) {
                return response.status(401).send(`You don't have permission.`);
            }
            const messages = await this.textService.findAllTextByChatId(chatEntity.id);
            if ((0, classificatedHttpCode_1.isNotFound)(messages)) {
                return response.status(204).send([]);
            }
            return response.status(200).send(messages.map((message) => text_entity_1.TextEntity.parserTextEntityToDTO(message)));
        }
        catch (error) {
            this.logger.error('findAllTextByChatId', error);
            return response.status(500).send('Something went wrong.');
        }
    }
    async createText(response, request, text) {
        try {
            if (!this.isSanitedText(text)) {
                return response.status(400).send('Incorrect data.');
            }
            const idsExist = await this.areIdsExists(text.userId, text.chatId);
            if (!idsExist) {
                return response.status(404).send('Data ids Not found.');
            }
            const foundChat = await this.chatService.findChatById(text.chatId);
            const hasPermission = (0, isOwn_1.isOwn)(request.user.id, foundChat.userId1) || (0, isOwn_1.isOwn)(request.user.id, foundChat.userId2);
            if (!hasPermission) {
                return response.status(401).send(`You don't have permission.`);
            }
            const createdText = await this.textService.createText(text);
            const newMessage = text_entity_1.TextEntity.parserTextPublicEntityToDTO(createdText);
            this.webSocketsGateway.handleCreateMessage(foundChat, newMessage);
            return response.status(201).send(newMessage);
        }
        catch (err) {
            this.logger.error('createText', err);
            return response.status(500).send('Something went wrong.');
        }
    }
    async updateText(response, request, id, text) {
        if (!text) {
            return response.status(400).send('Incorrect data.');
        }
        try {
            const foundText = await this.textService.findTextById(id);
            if (!foundText) {
                return response.status(404).send('Not found.');
            }
            const foundChat = await this.chatService.findChatById(foundText.chatId);
            if (!(0, isOwn_1.isOwn)(request.user.id, foundChat.userId1) && !(0, isOwn_1.isOwn)(request.user.id, foundChat.userId2)) {
                return response.status(401).send(`You don't have permission.`);
            }
            const updatedText = await this.textService.updateText(Object.assign(Object.assign({}, text_entity_1.TextEntity.parserTextPublicEntityToDTO(foundText)), { text: text }));
            return response.status(200).send(text_entity_1.TextEntity.parserTextPublicEntityToDTO(updatedText));
        }
        catch (err) {
            this.logger.error('updateText', err);
            return response.status(500).send('Error: ' + err.message);
        }
    }
    async deleteText(response, request, id) {
        if (!id) {
            return response.status(400).send('Incorrect data.');
        }
        try {
            const foundText = await this.textService.findTextById(id);
            if (!foundText) {
                return response.status(404).send('Not found.');
            }
            const foundChat = await this.chatService.findChatById(foundText.chatId);
            if (!(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, foundChat.userId1) && !(0, isOwnOrAdmin_1.isOwnOrAdmin)(request.user, foundChat.userId2)) {
                return response.status(401).send(`You don't have permission.`);
            }
            if (request.user.id !== foundText.userId)
                return response.status(401).send(`You don't have permission.`);
            const deleteResult = await this.textService.deleteText(id);
            if (deleteResult > 0) {
                const newText = text_entity_1.TextEntity.parserTextPublicEntityToDTO(foundText);
                this.webSocketsGateway.handleDeleteMessage(foundChat, newText);
                return response.status(200).send(newText);
            }
            else {
                return response.status(404).send('Not Deleted.');
            }
        }
        catch (err) {
            this.logger.error('deleteText', err);
            return response.status(500).send('Error: ' + err.message);
        }
    }
    async areIdsExists(idUser, idChat) {
        if (!(await this.userService.findUserById(idUser)))
            return false;
        if (!(await this.chatService.findChatById(idChat)))
            return false;
        return true;
    }
    isSanitedText(newText) {
        if (!newText || !newText.text || !newText.userId || !newText.chatId)
            return false;
        return true;
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get a text.',
        description: 'This endpoint is enabled for the user owner of the text and users with role admin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the text.',
        type: text_dto_1.TextDTO,
    }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TextController.prototype, "findTextById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all texts from chat.',
        description: 'This endpoint is enabled for the user owner of the text and users with role admin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the all text.',
        isArray: true,
        type: text_dto_1.TextDTO,
    }),
    (0, common_1.Get)('chat/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TextController.prototype, "findAllTextByChatId", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a text.',
        description: 'This endpoint is enabled for the users participants of the chat.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the created text.',
        type: text_public_dto_1.TextPublicDTO,
    }),
    (0, common_1.Post)(''),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, text_create_dto_1.TextCreateDTO]),
    __metadata("design:returntype", Promise)
], TextController.prototype, "createText", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update a text.',
        description: 'This endpoint is enabled for the user owner of the text.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the updated text.',
        type: text_create_dto_1.TextCreateDTO,
    }),
    (0, roles_decorator_1.Roles)('user'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], TextController.prototype, "updateText", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a text.',
        description: 'This endpoint is enabled for the user owner of the text and the user with role admin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the delete text.',
        type: text_public_dto_1.TextPublicDTO,
    }),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TextController.prototype, "deleteText", null);
TextController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('TEXT'),
    (0, common_1.Controller)('text'),
    __metadata("design:paramtypes", [text_service_1.TextService,
        user_service_1.UserService,
        chat_service_1.ChatService,
        common_1.Logger,
        webSockets_gateway_1.WebSocketsGateway])
], TextController);
exports.TextController = TextController;
//# sourceMappingURL=text.controller.js.map