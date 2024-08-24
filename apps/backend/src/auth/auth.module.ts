import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
require('dotenv').config();

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    Logger,
    // Use AuthGard in all endpoints
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY_JWT,
      signOptions: { expiresIn: '20s' },
    }),
  ]
})
export class AuthModule { }
