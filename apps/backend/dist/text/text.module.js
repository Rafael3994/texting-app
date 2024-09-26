"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TextModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextModule = void 0;
const common_1 = require("@nestjs/common");
const text_controller_1 = require("./text.controller");
const text_service_1 = require("./text.service");
const text_entity_1 = require("./entity/text.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("../user/user.module");
const chat_module_1 = require("../chat/chat.module");
const webSockets_gateway_1 = require("../web-sockets/webSockets.gateway");
let TextModule = TextModule_1 = class TextModule {
};
TextModule = TextModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([text_entity_1.TextEntity]),
            user_module_1.UserModule,
            (0, common_1.forwardRef)(() => chat_module_1.ChatModule),
        ],
        controllers: [text_controller_1.TextController],
        providers: [text_service_1.TextService, common_1.Logger, webSockets_gateway_1.WebSocketsGateway],
        exports: [text_service_1.TextService, TextModule_1],
    })
], TextModule);
exports.TextModule = TextModule;
//# sourceMappingURL=text.module.js.map