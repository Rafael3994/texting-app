import { Logger } from '@nestjs/common';
import { BlacklistRefreshTokenEntity } from './entity/blacklist-refresh-token.entity';
import { Repository } from 'typeorm';
export declare class BlacklistRefreshTokenService {
    private readonly blacklistRepository;
    private logger;
    constructor(blacklistRepository: Repository<BlacklistRefreshTokenEntity>, logger: Logger);
    createBlacklistToken(token: string): Promise<BlacklistRefreshTokenEntity>;
    isTokeninTheBlacklisted(token: string): Promise<boolean>;
    handleCron(): Promise<void>;
}
