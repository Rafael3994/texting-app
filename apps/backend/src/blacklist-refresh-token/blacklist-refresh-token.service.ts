import { Injectable } from '@nestjs/common';
import { BlacklistRefreshTokenEntity } from './entity/blacklist-refresh-token.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BlacklistRefreshTokenService {
    constructor(
        @InjectRepository(BlacklistRefreshTokenEntity)
        private readonly blacklistRepository: Repository<BlacklistRefreshTokenEntity>,
    ) { }

    async createBlacklistToken(token: string): Promise<BlacklistRefreshTokenEntity> {
        return await this.blacklistRepository.save({ token });
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const tokenInBlacklist = await this.blacklistRepository.findOne({ where: { token } });
        return !!!tokenInBlacklist;
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleCron() {
        const actualDate = new Date();
        actualDate.setDate(actualDate.getDate() - 7);

        await this.blacklistRepository.delete({
            createdTime: LessThan(actualDate),
        });
    }

}
