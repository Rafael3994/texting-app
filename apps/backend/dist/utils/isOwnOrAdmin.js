"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnOrAdmin = void 0;
const user_entity_1 = require("../user/entity/user.entity");
const isOwnOrAdmin = (userSignIn, idPass) => {
    if (userSignIn.role === user_entity_1.UserRoles.ADMIN) {
        return true;
    }
    else {
        return userSignIn.id === idPass;
    }
};
exports.isOwnOrAdmin = isOwnOrAdmin;
//# sourceMappingURL=isOwnOrAdmin.js.map