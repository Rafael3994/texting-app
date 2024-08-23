import { Logger, Module } from '@nestjs/common';
import { TextController } from './text.controller';
import { TextService } from './text.service';
import { Repository } from 'typeorm';
import { TextEntity } from './entity/text.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextEntity]),
    UserModule,
    ChatModule,
  ],
  controllers: [TextController],
  providers: [TextService, Logger],
  exports: [TextService],
})
export class TextModule { }
