"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistRefreshTokenDTO = void 0;
const openapi = require("@nestjs/swagger");
class BlacklistRefreshTokenDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, token: { required: true, type: () => String }, createdTime: { required: false, type: () => Date } };
    }
}
exports.BlacklistRefreshTokenDTO = BlacklistRefreshTokenDTO;
//# sourceMappingURL=blacklist-refresh-token.dto.js.map