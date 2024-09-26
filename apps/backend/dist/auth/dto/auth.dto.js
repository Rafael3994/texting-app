"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDTO = void 0;
const openapi = require("@nestjs/swagger");
class AuthDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
exports.AuthDTO = AuthDTO;
//# sourceMappingURL=auth.dto.js.map