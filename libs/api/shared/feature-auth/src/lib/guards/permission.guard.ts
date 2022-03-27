import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@tempus/shared-domain';
import { CommonService } from '@tempus/api/shared/feature-common';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(private reflector: Reflector, private commonService: CommonService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { user } = request;
		const { body } = request;
		const { params } = request;
		let entity;

		if (params) {
			entity = await this.commonService.findById(params.id);
		} else if (body) {
			entity = await this.commonService.findByEmail(body.id);
		} else {
			return false;
		}

		if (!user.roles.includes(RoleType.BUSINESS_OWNER)) {
			if (user.email !== entity.email) {
				throw new ForbiddenException('Forbidedn.');
			}
		}

		return true;
	}
}
