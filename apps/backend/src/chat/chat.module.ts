import { forwardRef, Logger, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entity/chat.entity';
import { UserModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { TextModule } from 'src/text/text.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
    UserModule,
    TextModule,
    forwardRef(() => TextModule),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    Logger,
  ],
  exports: [ChatService],
})
export class ChatModule { }
