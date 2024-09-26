"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDTO = void 0;
const openapi = require("@nestjs/swagger");
class ChatDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId1: { required: true, type: () => String }, userId2: { required: true, type: () => String }, createdTime: { required: true, type: () => Date }, user1: { required: false, type: () => require("../../user/dto/user.public.dto").UserPublicDTO }, user2: { required: false, type: () => require("../../user/dto/user.public.dto").UserPublicDTO }, texts: { required: false, type: () => [require("../../text/dto/text.public.dto").TextPublicDTO] } };
    }
}
exports.ChatDTO = ChatDTO;
//# sourceMappingURL=chat.dto.js.map