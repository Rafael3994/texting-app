import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistRefreshTokenController } from './blacklist-refresh-token.controller';

describe('BlacklistRefreshTokenController', () => {
  let controller: BlacklistRefreshTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlacklistRefreshTokenController],
    }).compile();

    controller = module.get<BlacklistRefreshTokenController>(BlacklistRefreshTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
