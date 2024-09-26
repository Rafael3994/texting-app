"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextPublicDTO = void 0;
const openapi = require("@nestjs/swagger");
class TextPublicDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, chatId: { required: true, type: () => String }, text: { required: true, type: () => String }, createdTime: { required: false, type: () => Date } };
    }
}
exports.TextPublicDTO = TextPublicDTO;
//# sourceMappingURL=text.public.dto.js.map