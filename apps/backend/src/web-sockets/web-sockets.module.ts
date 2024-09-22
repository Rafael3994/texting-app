import { Module } from '@nestjs/common';
import { WebSocketsGateway } from './webSockets.gateway';

@Module({
    imports: [WebSocketsGateway],
    exports: [WebSocketsGateway],
})
export class WebSocketsModule { }
