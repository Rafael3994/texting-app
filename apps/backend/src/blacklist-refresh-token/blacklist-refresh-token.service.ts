import { Injectable, Logger } from '@nestjs/common';
import { BlacklistRefreshTokenEntity } from './entity/blacklist-refresh-token.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BlacklistRefreshTokenService {
    constructor(
        @InjectRepository(BlacklistRefreshTokenEntity)
        private readonly blacklistRepository: Repository<BlacklistRefreshTokenEntity>,
        private logger: Logger,
    ) { }

    async createBlacklistToken(token: string): Promise<BlacklistRefreshTokenEntity> {
        try {
            console.log('XXX token for create', token);
            return await this.blacklistRepository.save({ token });
        } catch (err) {
            this.logger.error('createBlacklistToken err:', err)
        }
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        try {
            const tokenInBlacklist = await this.blacklistRepository.findOne({ where: { token } });
            return !!!tokenInBlacklist;
        } catch (err) {
            this.logger.error('isTokenBlacklisted err:', err)
        }
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleCron() {
        try {
            const actualDate = new Date();
            actualDate.setDate(actualDate.getDate() - 7);

            await this.blacklistRepository.delete({
                createdTime: LessThan(actualDate),
            });
        } catch (err) {
            this.logger.error('handleCron err:', err)
        }
    }

}
