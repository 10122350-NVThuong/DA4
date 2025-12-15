import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.VaiTro) {
      throw new ForbiddenException('Access denied: No role assigned');
    }

    const userRole = user.VaiTro;

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `You do not have access. Required one of: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
