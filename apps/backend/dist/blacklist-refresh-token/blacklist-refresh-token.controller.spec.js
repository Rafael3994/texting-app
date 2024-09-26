"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const blacklist_refresh_token_controller_1 = require("./blacklist-refresh-token.controller");
describe('BlacklistRefreshTokenController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [blacklist_refresh_token_controller_1.BlacklistRefreshTokenController],
        }).compile();
        controller = module.get(blacklist_refresh_token_controller_1.BlacklistRefreshTokenController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=blacklist-refresh-token.controller.spec.js.map