import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { BlacklistRefreshTokenService } from '@src/blacklist-refresh-token/blacklist-refresh-token.service';
export declare class AuthController {
    private authService;
    private blackListRefreshTokenService;
    private logger;
    constructor(authService: AuthService, blackListRefreshTokenService: BlacklistRefreshTokenService, logger: Logger);
    signIn(response: any, signAuth: AuthDTO): Promise<any>;
    refreshToken(request: any, response: any): Promise<any>;
    getProfile(req: any): any;
}
