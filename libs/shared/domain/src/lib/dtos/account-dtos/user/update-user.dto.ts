import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserEntity } from '../../../entities/account-entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}

	public static toEntity(dto: UpdateUserDto): UserEntity {
		if (dto == null) return new UserEntity();
		return new UserEntity(dto.id, dto.firstName, dto.lastName, dto.email, dto.password, dto.roles);
	}
}
