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

		console.log(user.email);
		if (Object.keys(params).length !== 0) {
			console.log('hello');
			entity = await this.commonService.findById(params.userId);
		} else if (Object.keys(body).length !== 0) {
			entity = await this.commonService.findById(body.id);
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
