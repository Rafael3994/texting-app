import { forwardRef, Logger, Module } from '@nestjs/common';
import { TextController } from './text.controller';
import { TextService } from './text.service';
import { TextEntity } from './entity/text.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@src/user/user.module';
import { ChatModule } from '@src/chat/chat.module';
import { WebSocketsGateway } from '@src/web-sockets/webSockets.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextEntity]),
    UserModule,
    forwardRef(() => ChatModule),
  ],
  controllers: [TextController],
  providers: [TextService, Logger, WebSocketsGateway],
  exports: [TextService, TextModule],
})
export class TextModule { }
