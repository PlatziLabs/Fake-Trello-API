import { Controller, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { SeedService } from '@services/seed.service';

@Controller('seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @ApiExcludeEndpoint()
  @Post()
  init() {
    return this.seedService.init();
  }
}
