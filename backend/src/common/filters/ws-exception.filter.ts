import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('WsExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    let message = 'WebSocket error';
    let code = 'WS_ERROR';

    if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`WebSocket error: ${exception.message}`, exception.stack);
    }

    client.emit('error', {
      code,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
