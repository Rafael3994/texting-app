import { Injectable } from '@nestjs/common';
import { BlacklistRefreshTokenEntity } from './entity/blacklist-refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlacklistRefreshTokenService {
    constructor(
        @InjectRepository(BlacklistRefreshTokenEntity)
        private readonly blacklistRepository: Repository<BlacklistRefreshTokenEntity>,
    ) { }

    async createBlacklistToken(token: string): Promise<BlacklistRefreshTokenEntity> {
        return await this.blacklistRepository.save({ token });
    }

    // Verificar si un token está en la lista negra
    async isTokenBlacklisted(token: string): Promise<boolean> {
        const tokenInBlacklist = await this.blacklistRepository.findOne({ where: { token } });
        console.log('tokenInBlacklist', tokenInBlacklist);

        return !!!tokenInBlacklist;
    }

}
