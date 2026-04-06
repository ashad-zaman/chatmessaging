import { Module, Global, Provider } from '@nestjs/common';

export const SOCKET_ADAPTER = 'SOCKET_ADAPTER';

@Global()
@Module({
  providers: [
    {
      provide: SOCKET_ADAPTER,
      useValue: null,
    },
  ],
  exports: [SOCKET_ADAPTER],
})
export class SocketModule {}
