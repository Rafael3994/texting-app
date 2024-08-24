import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, password: string): Promise<any> {
        if (!email || !password) throw new Error('Incorrect data.');

        console.log('Pass', { email, password });
        const user = await this.usersService.findUserByEmail(
            email,
            ["id", "name", "email", "password"],
        );
        console.log('User', user);

        const res = await bcrypt.compare(password, user.password)
        if (!user || !res) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.name, email: user.email };
        console.log('payload', payload);
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
