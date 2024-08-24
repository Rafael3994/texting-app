import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private logger: Logger,
    ) { }

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
            return response.status(500).send('Something was bad.');
        }
    }
}
