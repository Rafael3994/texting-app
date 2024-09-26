"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextDTO = void 0;
const openapi = require("@nestjs/swagger");
class TextDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, chatId: { required: true, type: () => String }, text: { required: true, type: () => String }, createdTime: { required: false, type: () => Date }, user: { required: false, type: () => require("../../user/dto/user.public.dto").UserPublicDTO }, chat: { required: false, type: () => require("../../chat/dto/chat.dto").ChatDTO } };
    }
}
exports.TextDTO = TextDTO;
//# sourceMappingURL=text.dto.js.map