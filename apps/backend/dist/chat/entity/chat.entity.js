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
exports.ChatEntity = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const text_entity_1 = require("../../text/entity/text.entity");
let ChatEntity = class ChatEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId1: { required: true, type: () => String }, userId2: { required: true, type: () => String }, createdTime: { required: true, type: () => Date }, user1: { required: true, type: () => require("../../user/entity/user.entity").UserEntity }, user2: { required: true, type: () => require("../../user/entity/user.entity").UserEntity }, texts: { required: true, type: () => [require("../../text/entity/text.entity").TextEntity] } };
    }
};
ChatEntity.parserChatEntityToDTO = (chatEntity) => {
    const userDTO = {
        id: chatEntity.id,
        userId1: chatEntity.userId1,
        userId2: chatEntity.userId2,
        createdTime: chatEntity.createdTime,
        user1: chatEntity.user1 && user_entity_1.UserEntity.parserUserPublicEntityToDTO(chatEntity.user1),
        user2: chatEntity.user1 && user_entity_1.UserEntity.parserUserPublicEntityToDTO(chatEntity.user2),
        texts: chatEntity.texts && chatEntity.texts.map((text) => text_entity_1.TextEntity.parserTextPublicEntityToDTO(text))
    };
    return userDTO;
};
ChatEntity.parserChatPublicEntityToDTO = (chatEntity) => {
    const userDTO = {
        id: chatEntity.id,
        userId1: chatEntity.userId1,
        userId2: chatEntity.userId2,
        createdTime: chatEntity.createdTime,
    };
    return userDTO;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], ChatEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id_1' }),
    __metadata("design:type", String)
], ChatEntity.prototype, "userId1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id_2' }),
    __metadata("design:type", String)
], ChatEntity.prototype, "userId2", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_time', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ChatEntity.prototype, "createdTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.chatsAsUser1),
    (0, typeorm_1.JoinColumn)({ name: 'user_id_1' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ChatEntity.prototype, "user1", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.chatsAsUser2),
    (0, typeorm_1.JoinColumn)({ name: 'user_id_2' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ChatEntity.prototype, "user2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => text_entity_1.TextEntity, text => text.chat, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], ChatEntity.prototype, "texts", void 0);
ChatEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'chat' })
], ChatEntity);
exports.ChatEntity = ChatEntity;
//# sourceMappingURL=chat.entity.js.map