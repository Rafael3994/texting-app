import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@src/user/user.service';
import { TokensDTO } from './dto/tokens.dto';
import { UserEntity } from '@src/user/entity/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private logger;
    constructor(usersService: UserService, jwtService: JwtService, logger: Logger);
    signIn(email: string, password: string): Promise<TokensDTO>;
    refreshToken(refreshToken: string): Promise<TokensDTO>;
    genereateTokens(user: UserEntity): Promise<TokensDTO>;
}
