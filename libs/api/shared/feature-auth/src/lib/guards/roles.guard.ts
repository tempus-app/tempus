import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@tempus/shared-domain';
import { ROLES_KEY } from '../roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) {
			return true;
		}

		// extracting user from `req.user`. In this case,  user is the JWT Access Token Payload, which includes roles.
		const { user } = context.switchToHttp().getRequest();
		return requiredRoles.some(role => user.roles?.includes(role));
	}
}
