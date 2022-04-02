import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IUpdateProjectDto } from '@tempus/shared-domain';
import { CreateProjectDto } from './createProject.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) implements IUpdateProjectDto {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
