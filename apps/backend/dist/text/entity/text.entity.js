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
exports.TextEntity = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const chat_entity_1 = require("../../chat/entity/chat.entity");
let TextEntity = class TextEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, chatId: { required: true, type: () => String }, userId: { required: true, type: () => String }, text: { required: true, type: () => String }, createdTime: { required: true, type: () => Date }, chat: { required: true, type: () => require("../../chat/entity/chat.entity").ChatEntity }, user: { required: true, type: () => require("../../user/entity/user.entity").UserEntity } };
    }
};
TextEntity.parserTextEntityToDTO = (textEntity) => {
    const textDTO = {
        id: textEntity.id,
        userId: textEntity.userId,
        chatId: textEntity.chatId,
        text: textEntity.text,
        user: textEntity.user && user_entity_1.UserEntity.parserUserPublicEntityToDTO(textEntity.user),
        chat: textEntity.chat && chat_entity_1.ChatEntity.parserChatEntityToDTO(textEntity.chat),
    };
    return textDTO;
};
TextEntity.parserTextPublicEntityToDTO = (textEntity) => {
    const textDTO = {
        id: textEntity.id,
        userId: textEntity.userId,
        chatId: textEntity.chatId,
        text: textEntity.text,
        createdTime: textEntity.createdTime,
    };
    return textDTO;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], TextEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'chat_id' }),
    __metadata("design:type", String)
], TextEntity.prototype, "chatId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], TextEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], TextEntity.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_time', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TextEntity.prototype, "createdTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_entity_1.ChatEntity, (chat) => chat.texts, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'chat_id' }),
    __metadata("design:type", chat_entity_1.ChatEntity)
], TextEntity.prototype, "chat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.texts),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], TextEntity.prototype, "user", void 0);
TextEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'text' })
], TextEntity);
exports.TextEntity = TextEntity;
//# sourceMappingURL=text.entity.js.map