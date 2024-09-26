"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user/entity/user.entity");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const chat_module_1 = require("./chat/chat.module");
const text_module_1 = require("./text/text.module");
const chat_entity_1 = require("./chat/entity/chat.entity");
const text_entity_1 = require("./text/entity/text.entity");
const auth_module_1 = require("./auth/auth.module");
const blacklist_refresh_token_module_1 = require("./blacklist-refresh-token/blacklist-refresh-token.module");
const blacklist_refresh_token_entity_1 = require("./blacklist-refresh-token/entity/blacklist-refresh-token.entity");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const web_sockets_module_1 = require("./web-sockets/web-sockets.module");
require('dotenv').config();
const env = {
    HOST: process.env.HOST,
    PORT: +process.env.PORT,
    USER_NAME: process.env.USER_NAME,
    PASSWORD: process.env.PASSWORD,
    DATABASE: process.env.DATABASE,
    TYPE: process.env.TYPE,
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
            user_module_1.UserModule,
            chat_module_1.ChatModule,
            text_module_1.TextModule,
            auth_module_1.AuthModule,
            web_sockets_module_1.WebSocketsModule,
            blacklist_refresh_token_module_1.BlacklistRefreshTokenModule,
            schedule_1.ScheduleModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '../../', 'frontend/dist'),
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: env.TYPE,
                host: env.HOST,
                port: env.PORT,
                username: env.USER_NAME,
                password: env.PASSWORD,
                database: env.DATABASE,
                entities: [
                    user_entity_1.UserEntity,
                    chat_entity_1.ChatEntity,
                    text_entity_1.TextEntity,
                    blacklist_refresh_token_entity_1.BlacklistRefreshTokenEntity,
                ],
                synchronize: false,
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map