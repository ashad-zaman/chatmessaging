import { Module, Global, Provider } from '@nestjs/common';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class LoggerModule {}
