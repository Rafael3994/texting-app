"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectIdToDoTheSearch = void 0;
const user_entity_1 = require("../user/entity/user.entity");
const selectIdToDoTheSearch = (user, idDefault) => {
    if (!idDefault)
        return null;
    if (user.role === user_entity_1.UserRoles.ADMIN) {
        if (!idDefault)
            return null;
        return idDefault;
    }
    else {
        return user.id;
    }
};
exports.selectIdToDoTheSearch = selectIdToDoTheSearch;
//# sourceMappingURL=selectIdToDoTheSearch.js.map