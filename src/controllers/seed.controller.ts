import { Controller, Post } from '@nestjs/common';

import { SeedService } from '@services/seed.service';

@Controller('seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @Post()
  init() {
    return this.seedService.init();
  }
}
