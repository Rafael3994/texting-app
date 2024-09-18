import { Logger, Module } from '@nestjs/common';
import { BlacklistRefreshTokenController } from './blacklist-refresh-token.controller';
import { BlacklistRefreshTokenService } from './blacklist-refresh-token.service';
import { BlacklistRefreshTokenEntity } from './entity/blacklist-refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistRefreshTokenEntity]),],
  controllers: [BlacklistRefreshTokenController],
  providers: [BlacklistRefreshTokenService, Logger],
  exports: [BlacklistRefreshTokenService],
})
export class BlacklistRefreshTokenModule { }
