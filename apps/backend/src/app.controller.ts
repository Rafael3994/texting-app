import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';

@ApiTags('')
@Controller('/test')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiExcludeEndpoint()
  @Public()
  @Get('')
  isBackendTurnedOn(): boolean {
    return this.appService.isBackendTurnedOn();
  }
}
