"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextCreateDTO = void 0;
const openapi = require("@nestjs/swagger");
class TextCreateDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, chatId: { required: true, type: () => String }, text: { required: true, type: () => String } };
    }
}
exports.TextCreateDTO = TextCreateDTO;
//# sourceMappingURL=text.create.dto.js.map