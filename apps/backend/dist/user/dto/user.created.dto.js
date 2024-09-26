"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreatedDTO = void 0;
const openapi = require("@nestjs/swagger");
class UserCreatedDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
exports.UserCreatedDTO = UserCreatedDTO;
//# sourceMappingURL=user.created.dto.js.map