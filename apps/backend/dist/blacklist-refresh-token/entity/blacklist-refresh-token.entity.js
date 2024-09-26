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
exports.BlacklistRefreshTokenEntity = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let BlacklistRefreshTokenEntity = class BlacklistRefreshTokenEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, token: { required: true, type: () => String }, createdTime: { required: true, type: () => Date } };
    }
};
BlacklistRefreshTokenEntity.parserBlacklistRefreshTokenEntityToDTO = (blacklistRefreshTokenEntity) => {
    const blacklistRefreshTokenDTO = {
        id: blacklistRefreshTokenEntity.id,
        token: blacklistRefreshTokenEntity.token,
        createdTime: blacklistRefreshTokenEntity.createdTime,
    };
    return blacklistRefreshTokenDTO;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], BlacklistRefreshTokenEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], BlacklistRefreshTokenEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_time', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BlacklistRefreshTokenEntity.prototype, "createdTime", void 0);
BlacklistRefreshTokenEntity = __decorate([
    (0, typeorm_1.Entity)('blacklist_refresh_token')
], BlacklistRefreshTokenEntity);
exports.BlacklistRefreshTokenEntity = BlacklistRefreshTokenEntity;
//# sourceMappingURL=blacklist-refresh-token.entity.js.map