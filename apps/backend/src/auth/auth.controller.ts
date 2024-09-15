import { Body, Controller, Get, Logger, Post, Res, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { BlacklistRefreshTokenService } from '@src/blacklist-refresh-token/blacklist-refresh-token.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokensDTO } from './dto/tokens.dto';
import { UserDTO } from '@src/user/dto/user.dto';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private blackListRefreshTokenService: BlacklistRefreshTokenService,
        private logger: Logger,
    ) { }

    @ApiOperation({
        summary: 'Login.',
        description: 'Do a login with a user in the application.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the access_token and the refresh_token.',
        type: TokensDTO,
    })
    @Public()
    @Post('login')
    async signIn(
        @Res() response,
        @Body() signAuth: AuthDTO
    ) {
        try {
            const tokens = await this.authService.signIn(signAuth.email, signAuth.password)
            response.cookie('refresh_cookie', tokens.refresh_token, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            return response.status(200).send(
                tokens
            );
        } catch (error) {
            this.logger.error('signIn', error);
            return response.status(500).send(error.message);
        }
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Refresh token.',
        description: 'Renew the token with the refresh token.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the access_token and the refresh_token.',
        type: TokensDTO,
    })
    @Public()
    @Post('refresh')
    async refreshToken(
        @Req() request,
        @Res() response,
    ) {
        try {
            const refreshToken = request.headers['x-refresh-token']

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

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Show the user logit.',
        description: 'Show the data from the user in the token.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the user logit',
        type: UserDTO,
    })
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
