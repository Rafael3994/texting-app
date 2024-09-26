"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ChatModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_controller_1 = require("./chat.controller");
const chat_service_1 = require("./chat.service");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entity/chat.entity");
const user_module_1 = require("../user/user.module");
const text_module_1 = require("../text/text.module");
const webSockets_gateway_1 = require("../web-sockets/webSockets.gateway");
let ChatModule = ChatModule_1 = class ChatModule {
};
ChatModule = ChatModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([chat_entity_1.ChatEntity]),
            user_module_1.UserModule,
            text_module_1.TextModule,
            (0, common_1.forwardRef)(() => text_module_1.TextModule),
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chat_service_1.ChatService,
            common_1.Logger,
            webSockets_gateway_1.WebSocketsGateway,
        ],
        exports: [chat_service_1.ChatService, ChatModule_1],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map