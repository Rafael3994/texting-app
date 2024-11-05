import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  isBackendTurnedOn(): boolean {
    return true;
  }
}
