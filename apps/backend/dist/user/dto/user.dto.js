"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
const openapi = require("@nestjs/swagger");
class UserDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: false, type: () => String }, role: { required: true, enum: require("../entity/user.entity").UserRoles }, createdTime: { required: false, type: () => Date } };
    }
}
exports.UserDTO = UserDTO;
//# sourceMappingURL=user.dto.js.map