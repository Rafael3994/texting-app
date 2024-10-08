import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';
import { TextModule } from './text/text.module';
import { ChatEntity } from './chat/entity/chat.entity';
import { TextEntity } from './text/entity/text.entity';
import { AuthModule } from './auth/auth.module';
import { BlacklistRefreshTokenModule } from './blacklist-refresh-token/blacklist-refresh-token.module';
import { BlacklistRefreshTokenEntity } from './blacklist-refresh-token/entity/blacklist-refresh-token.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { WebSocketsModule } from './web-sockets/web-sockets.module';

require('dotenv').config();

const isProduction = !!process.env.URL_DB_RENDER;
const env = {
  HOST: process.env.HOST,
  PORT: +process.env.PORT,
  USER_NAME: process.env.USER_NAME,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
  TYPE: process.env.TYPE as "mysql" | "mariadb" | "postgres" | "sqlite" | "mssql",
  URL_DB_RENDER: process.env.URL_DB_RENDER,
}


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    UserModule,
    ChatModule,
    TextModule,
    AuthModule,
    WebSocketsModule,
    BlacklistRefreshTokenModule,
    ScheduleModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../', 'frontend/dist'),
    // }),
    TypeOrmModule.forRoot({
      url: isProduction ? env.URL_DB_RENDER : undefined,
      type: env.TYPE,
      host: isProduction ? undefined : env.HOST,
      port: isProduction ? undefined : env.PORT,
      username: isProduction ? undefined : env.USER_NAME,
      password: isProduction ? undefined : env.PASSWORD,
      database: isProduction ? undefined : env.DATABASE,
      entities: [
        UserEntity,
        ChatEntity,
        TextEntity,
        BlacklistRefreshTokenEntity,
      ],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
