import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistRefreshTokenService } from './blacklist-refresh-token.service';

describe('BlacklistRefreshTokenService', () => {
  let service: BlacklistRefreshTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlacklistRefreshTokenService],
    }).compile();

    service = module.get<BlacklistRefreshTokenService>(BlacklistRefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
