import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/role.guards';
import { Roles } from './role.decorator';

export function Auth(...roles: string[]) {
  if (roles.length > 0) {
    return applyDecorators(
      Roles(...roles),
      UseGuards(AuthGuard('jwt'), RolesGuard),
    );
  }

  return applyDecorators(UseGuards(AuthGuard('jwt')));
}
