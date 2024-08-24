import { Logger, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entity/chat.entity.dto';
import { UserModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
    UserModule
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    Logger,
  ],
  exports: [ChatService],
})
export class ChatModule { }
