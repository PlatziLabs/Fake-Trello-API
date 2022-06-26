import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { TokenPayload } from '@models/token.model';
import { UsersService } from '@services/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const headers: any = request.headers;
    const hasBearerToken = headers?.authorization;
    if (hasBearerToken) {
      return true;
    }
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const token = request.user as TokenPayload;
    const user = await this.userService.findUserById(token.userId);
    const isAuthorized = user.role && roles.some((item) => item === user.role);
    if (!isAuthorized) {
      throw new UnauthorizedException(
        `Your role as ${user.role} is not authorized`,
      );
    }
    return isAuthorized;
  }
}
