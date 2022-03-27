import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@tempus/shared-domain';
import { CommonService } from '@tempus/api/shared/feature-common';

@Injectable()
export class ViewsGuard implements CanActivate {
	constructor(private reflector: Reflector, private commonService: CommonService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { user } = request;
		const { params } = request;
		let entity;

		if (Object.keys(params).length !== 0) {
			entity = await this.commonService.findUserByViewId(params.viewId);
		} else {
			return false;
		}

		if (!user.roles.includes(RoleType.BUSINESS_OWNER)) {
			if (user.email !== entity.email) {
				throw new ForbiddenException('Forbidden.');
			}
		}

		return true;
	}
}
