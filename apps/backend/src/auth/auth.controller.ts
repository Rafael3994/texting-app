import { Body, Controller, Get, Logger, Post, Res, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDTO } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
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

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
