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
exports.BlacklistRefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const blacklist_refresh_token_entity_1 = require("./entity/blacklist-refresh-token.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
let BlacklistRefreshTokenService = class BlacklistRefreshTokenService {
    constructor(blacklistRepository, logger) {
        this.blacklistRepository = blacklistRepository;
        this.logger = logger;
    }
    async createBlacklistToken(token) {
        try {
            return await this.blacklistRepository.save({ token });
        }
        catch (err) {
            this.logger.error('createBlacklistToken err:', err);
        }
    }
    async isTokeninTheBlacklisted(token) {
        try {
            const tokenInBlacklist = await this.blacklistRepository.findOne({ where: { token } });
            return !!tokenInBlacklist;
        }
        catch (err) {
            this.logger.error('isTokenBlacklisted err:', err);
        }
    }
    async handleCron() {
        try {
            const actualDate = new Date();
            actualDate.setDate(actualDate.getDate() - 7);
            await this.blacklistRepository.delete({
                createdTime: (0, typeorm_1.LessThan)(actualDate),
            });
        }
        catch (err) {
            this.logger.error('handleCron err:', err);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlacklistRefreshTokenService.prototype, "handleCron", null);
BlacklistRefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(blacklist_refresh_token_entity_1.BlacklistRefreshTokenEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        common_1.Logger])
], BlacklistRefreshTokenService);
exports.BlacklistRefreshTokenService = BlacklistRefreshTokenService;
//# sourceMappingURL=blacklist-refresh-token.service.js.map