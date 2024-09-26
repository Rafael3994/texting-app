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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketsGateway = exports.EVENTS_NAMES = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_dto_1 = require("../chat/dto/chat.dto");
const text_public_dto_1 = require("../text/dto/text.public.dto");
const chat_entity_1 = require("../chat/entity/chat.entity");
exports.EVENTS_NAMES = {
    CHAT_CREATED: 'chatCreated',
    CHAT_DELETED: 'chatDeleted',
    MESSAGE_CREATED: 'messageCreated',
    MESSAGE_DELETED: 'messageDeleted',
};
let WebSocketsGateway = class WebSocketsGateway {
    handleConnection(client) {
        client.join(`user_${client.handshake.auth.userId}`);
    }
    handleDisconnect(client) { }
    handleCreateChat(chatData) {
        const { userId1, userId2 } = chatData;
        this.server.to(`user_${userId1}`).emit(exports.EVENTS_NAMES.CHAT_CREATED, chatData);
        this.server.to(`user_${userId2}`).emit(exports.EVENTS_NAMES.CHAT_CREATED, chatData);
    }
    handleDeleteChat(chatData) {
        const { userId1, userId2 } = chatData;
        this.server.to(`user_${userId1}`).emit(exports.EVENTS_NAMES.CHAT_DELETED, chatData);
        this.server.to(`user_${userId2}`).emit(exports.EVENTS_NAMES.CHAT_DELETED, chatData);
    }
    handleCreateMessage(chatData, messagesData) {
        const { userId1, userId2 } = chatData;
        this.server.to(`user_${userId1}`).emit(exports.EVENTS_NAMES.MESSAGE_CREATED, messagesData);
        this.server.to(`user_${userId2}`).emit(exports.EVENTS_NAMES.MESSAGE_CREATED, messagesData);
    }
    handleDeleteMessage(chatData, messagesData) {
        const { userId1, userId2 } = chatData;
        this.server.to(`user_${userId1}`).emit(exports.EVENTS_NAMES.MESSAGE_DELETED, messagesData);
        this.server.to(`user_${userId2}`).emit(exports.EVENTS_NAMES.MESSAGE_DELETED, messagesData);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(exports.EVENTS_NAMES.CHAT_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChatDTO]),
    __metadata("design:returntype", void 0)
], WebSocketsGateway.prototype, "handleCreateChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(exports.EVENTS_NAMES.CHAT_DELETED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChatDTO]),
    __metadata("design:returntype", void 0)
], WebSocketsGateway.prototype, "handleDeleteChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(exports.EVENTS_NAMES.MESSAGE_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_entity_1.ChatEntity, text_public_dto_1.TextPublicDTO]),
    __metadata("design:returntype", void 0)
], WebSocketsGateway.prototype, "handleCreateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(exports.EVENTS_NAMES.MESSAGE_DELETED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_entity_1.ChatEntity, text_public_dto_1.TextPublicDTO]),
    __metadata("design:returntype", void 0)
], WebSocketsGateway.prototype, "handleDeleteMessage", null);
WebSocketsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], WebSocketsGateway);
exports.WebSocketsGateway = WebSocketsGateway;
//# sourceMappingURL=webSockets.gateway.js.map