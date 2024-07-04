import { Module } from '@nestjs/common';
import { TextController } from './text.controller';
import { TextService } from './text.service';

@Module({
  controllers: [TextController],
  providers: [TextService]
})
export class TextModule {}
