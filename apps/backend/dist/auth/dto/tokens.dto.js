"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensDTO = void 0;
const openapi = require("@nestjs/swagger");
class TokensDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { access_token: { required: true, type: () => String }, refresh_token: { required: true, type: () => String } };
    }
}
exports.TokensDTO = TokensDTO;
//# sourceMappingURL=tokens.dto.js.map