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
import { ChatEntity } from './chat/entity/chat.entity.dto';
import { TextEntity } from './text/entity/text.entity';
require('dotenv').config();

const env = {
  HOST: process.env.HOST,
  PORT: +process.env.PORT,
  USER_NAME: process.env.USER_NAME,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE
}

@Module({
  imports: [
    UserModule,
    ChatModule,
    TextModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend/dist'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.HOST,
      port: env.PORT,
      username: env.USER_NAME,
      password: env.PASSWORD,
      database: env.DATABASE,
      entities: [UserEntity, ChatEntity, TextEntity],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
