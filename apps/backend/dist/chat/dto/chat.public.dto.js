"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatPublicDTO = void 0;
const openapi = require("@nestjs/swagger");
class ChatPublicDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId1: { required: true, type: () => String }, userId2: { required: true, type: () => String }, createdTime: { required: true, type: () => Date } };
    }
}
exports.ChatPublicDTO = ChatPublicDTO;
//# sourceMappingURL=chat.public.dto.js.map