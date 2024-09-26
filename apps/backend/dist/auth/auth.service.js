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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const bcrypt = require('bcrypt');
let AuthService = class AuthService {
    constructor(usersService, jwtService, logger) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.logger = logger;
    }
    async signIn(email, password) {
        if (!email || !password)
            throw new Error('Incorrect data.');
        const user = await this.usersService.findUserByEmail(email, ["id", "name", "email", "password", "role"]);
        const res = await bcrypt.compare(password, user.password);
        if (!user || !res) {
            throw new common_1.UnauthorizedException();
        }
        return await this.genereateTokens(user);
    }
    async refreshToken(refreshToken) {
        try {
            const user = this.jwtService.verify(refreshToken, { secret: process.env.SECRET_REFRESH_KEY_JWT });
            return await this.genereateTokens(user);
        }
        catch (err) {
            this.logger.error('err refreshToken:', err);
            return null;
        }
    }
    async genereateTokens(user) {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: process.env.SECRET_REFRESH_KEY_JWT,
                expiresIn: '7d',
            })
        ]);
        return {
            access_token,
            refresh_token,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        common_1.Logger])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map