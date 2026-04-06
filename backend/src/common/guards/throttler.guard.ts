import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
