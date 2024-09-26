"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const blacklist_refresh_token_service_1 = require("./blacklist-refresh-token.service");
describe('BlacklistRefreshTokenService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [blacklist_refresh_token_service_1.BlacklistRefreshTokenService],
        }).compile();
        service = module.get(blacklist_refresh_token_service_1.BlacklistRefreshTokenService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=blacklist-refresh-token.service.spec.js.map