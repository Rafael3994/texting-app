import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@src/user/user.service';
import { TokensDTO } from './dto/tokens.dto';
import { UserEntity } from '@src/user/entity/user.entity';
import { UserDTO } from '@src/user/dto/user.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private logger: Logger,
    ) { }

    async signIn(email: string, password: string): Promise<TokensDTO> {
        if (!email || !password) throw new Error('Incorrect data.');

        const user = await this.usersService.findUserByEmail(
            email,
            ["id", "name", "email", "password", "role"],
        );

        const res = await bcrypt.compare(password, user.password)
        if (!user || !res) {
            throw new UnauthorizedException();
        }

        return await this.genereateTokens(user)
    }

    async refreshToken(refreshToken: string) {
        try {
            const user = this.jwtService.verify(
                refreshToken,
                { secret: process.env.SECRET_REFRESH_KEY_JWT }
            );
            return await this.genereateTokens(user);
        } catch (err) {
            this.logger.error('err refreshToken:', err)
            return null
        }
    }

    async genereateTokens(user: UserEntity): Promise<TokensDTO> {
        const payload: UserDTO = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: process.env.SECRET_REFRESH_KEY_JWT,
                expiresIn: '7d',
            })
        ]);

        return {
            access_token,
            refresh_token,
        };
    }

}
