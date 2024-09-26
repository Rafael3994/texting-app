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
exports.UserEntity = exports.UserRoles = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const text_entity_1 = require("../../text/entity/text.entity");
const chat_entity_1 = require("../../chat/entity/chat.entity");
var UserRoles;
(function (UserRoles) {
    UserRoles["USER"] = "user";
    UserRoles["ADMIN"] = "admin";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
let UserEntity = class UserEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String }, role: { required: true, enum: require("./user.entity").UserRoles }, createdTime: { required: true, type: () => Date }, chatsAsUser1: { required: true, type: () => [require("../../chat/entity/chat.entity").ChatEntity] }, chatsAsUser2: { required: true, type: () => [require("../../chat/entity/chat.entity").ChatEntity] }, texts: { required: true, type: () => [Object] } };
    }
};
UserEntity.parserUserEntityToDTO = (userEntity) => {
    const userDTO = {
        id: userEntity.id,
        name: userEntity.name,
        email: userEntity.email,
        password: userEntity.password,
        role: userEntity.role,
        createdTime: userEntity.createdTime,
    };
    return userDTO;
};
UserEntity.parserUserPublicEntityToDTO = (userEntity) => {
    const userDTO = {
        name: userEntity.name,
        email: userEntity.email,
    };
    return userDTO;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'name' }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'email' }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'password' }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRoles, name: 'role' }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_time', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdTime", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_entity_1.ChatEntity, (chat) => chat.user1),
    __metadata("design:type", Array)
], UserEntity.prototype, "chatsAsUser1", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_entity_1.ChatEntity, (chat) => chat.user2),
    __metadata("design:type", Array)
], UserEntity.prototype, "chatsAsUser2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => text_entity_1.TextEntity, text => text.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "texts", void 0);
UserEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'user' })
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map