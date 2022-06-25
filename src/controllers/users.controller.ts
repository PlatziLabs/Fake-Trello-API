import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '@services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getAll() {
    return this.usersService.getAll();
  }
}
