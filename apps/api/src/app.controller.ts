import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimitApi } from './resilience/rate-limiting.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @RateLimitApi()
  getHello(): string {
    return this.appService.getHello();
  }
}
