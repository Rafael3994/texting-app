"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPublicDTO = void 0;
const openapi = require("@nestjs/swagger");
class UserPublicDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, email: { required: true, type: () => String } };
    }
}
exports.UserPublicDTO = UserPublicDTO;
//# sourceMappingURL=user.public.dto.js.map