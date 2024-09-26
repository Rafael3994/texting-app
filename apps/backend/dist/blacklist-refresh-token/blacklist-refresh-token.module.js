"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistRefreshTokenModule = void 0;
const common_1 = require("@nestjs/common");
const blacklist_refresh_token_controller_1 = require("./blacklist-refresh-token.controller");
const blacklist_refresh_token_service_1 = require("./blacklist-refresh-token.service");
const blacklist_refresh_token_entity_1 = require("./entity/blacklist-refresh-token.entity");
const typeorm_1 = require("@nestjs/typeorm");
let BlacklistRefreshTokenModule = class BlacklistRefreshTokenModule {
};
BlacklistRefreshTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([blacklist_refresh_token_entity_1.BlacklistRefreshTokenEntity]),],
        controllers: [blacklist_refresh_token_controller_1.BlacklistRefreshTokenController],
        providers: [blacklist_refresh_token_service_1.BlacklistRefreshTokenService, common_1.Logger],
        exports: [blacklist_refresh_token_service_1.BlacklistRefreshTokenService],
    })
], BlacklistRefreshTokenModule);
exports.BlacklistRefreshTokenModule = BlacklistRefreshTokenModule;
//# sourceMappingURL=blacklist-refresh-token.module.js.map