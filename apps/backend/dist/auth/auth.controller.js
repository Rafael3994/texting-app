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
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const auth_guard_1 = require("./auth.guard");
const public_decorator_1 = require("./public.decorator");
const blacklist_refresh_token_service_1 = require("../blacklist-refresh-token/blacklist-refresh-token.service");
const swagger_1 = require("@nestjs/swagger");
const tokens_dto_1 = require("./dto/tokens.dto");
const user_dto_1 = require("../user/dto/user.dto");
let AuthController = class AuthController {
    constructor(authService, blackListRefreshTokenService, logger) {
        this.authService = authService;
        this.blackListRefreshTokenService = blackListRefreshTokenService;
        this.logger = logger;
    }
    async signIn(response, signAuth) {
        try {
            const tokens = await this.authService.signIn(signAuth.email, signAuth.password);
            response.cookie('refresh_cookie', tokens.refresh_token, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return response.status(200).send(tokens);
        }
        catch (error) {
            this.logger.error('signIn', error);
            return response.status(500).send(error.message);
        }
    }
    async refreshToken(request, response) {
        try {
            const refreshToken = request.headers['x-refresh-token'];
            if (await this.blackListRefreshTokenService.isTokeninTheBlacklisted(refreshToken)) {
                return response.status(500).send({
                    "statusCode": 500,
                    "message": "Bad Request"
                });
            }
            await this.blackListRefreshTokenService.createBlacklistToken(refreshToken);
            const newTokens = await this.authService.refreshToken(refreshToken);
            if (!newTokens)
                throw new common_1.BadRequestException();
            return response.status(200).send(newTokens);
        }
        catch (error) {
            this.logger.error('refreshToken', error);
            return response.status(500).send(error.message);
        }
    }
    getProfile(req) {
        return req.user;
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Login.',
        description: 'Do a login with a user in the application.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the access_token and the refresh_token.',
        type: tokens_dto_1.TokensDTO,
    }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.AuthDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh token.',
        description: 'Renew the token with the refresh token.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the access_token and the refresh_token.',
        type: tokens_dto_1.TokensDTO,
    }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Show the user logit.',
        description: 'Show the data from the user in the token.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the user logit',
        type: user_dto_1.UserDTO,
    }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('profile'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('AUTH'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        blacklist_refresh_token_service_1.BlacklistRefreshTokenService,
        common_1.Logger])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map