import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSkillDto } from '.';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
