"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCreateDTO = void 0;
const openapi = require("@nestjs/swagger");
class ChatCreateDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId1: { required: true, type: () => String }, userId2: { required: true, type: () => String } };
    }
}
exports.ChatCreateDTO = ChatCreateDTO;
//# sourceMappingURL=chat.create.dto.js.map