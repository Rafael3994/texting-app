import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Blacklist Refresh Token')
@Controller('blacklist-refresh-token')
export class BlacklistRefreshTokenController {}
