import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity, UserRoles } from '@src/user/entity/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: UserEntity = request.user;

        if (user.role === UserRoles.ADMIN || requiredRoles.includes(user.role)) {
            return true;
        }

        throw new ForbiddenException('You do not have permission to access this resource');
    }
}
