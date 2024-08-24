import { Body, Controller, Get, Logger, Post, Res, UseGuards, Request, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDTO } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { BlacklistRefreshTokenService } from 'src/blacklist-refresh-token/blacklist-refresh-token.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private blackListRefreshTokenService: BlacklistRefreshTokenService,
        private logger: Logger,
    ) { }

    @Public()
    @Post('login')
    async signIn(
        @Res() response,
        @Body() signAuth: authDTO
    ) {
        try {
            return response.status(200).send(
                await this.authService.signIn(signAuth.email, signAuth.password)
            );
        } catch (error) {
            this.logger.error('signIn', error);
            return response.status(500).send(error.message);
        }
    }

    @Public()
    @Post('refresh')
    async refreshToken(
        @Req() request,
        @Res() response,
    ) {
        try {
            const refreshToken = request.headers['authorization']?.split(' ')[1];
            if (!(await this.blackListRefreshTokenService.isTokenBlacklisted(refreshToken)))
                return response.status(401).send({
                    "statusCode": 401,
                    "message": "Unauthorized"
                });

            await this.blackListRefreshTokenService.createBlacklistToken(refreshToken);

            return response.status(200).send(
                await this.authService.refreshToken(
                    refreshToken
                )
            );
        } catch (error) {
            this.logger.error('refreshToken', error);
            return response.status(500).send(error.message);
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
