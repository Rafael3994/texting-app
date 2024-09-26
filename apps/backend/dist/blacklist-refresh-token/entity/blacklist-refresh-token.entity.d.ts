import { BlacklistRefreshTokenDTO } from '../dto/blacklist-refresh-token.dto';
export declare class BlacklistRefreshTokenEntity {
    id: string;
    token: string;
    createdTime: Date;
    static parserBlacklistRefreshTokenEntityToDTO: (blacklistRefreshTokenEntity: BlacklistRefreshTokenEntity) => BlacklistRefreshTokenDTO;
}
