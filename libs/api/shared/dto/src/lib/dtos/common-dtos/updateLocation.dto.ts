import { PartialType } from '@nestjs/swagger';
import { IUpdateLocationDto } from '@tempus/shared-domain';
import { CreateLocationDto } from '.';

export class UpdateLocationDto extends PartialType(CreateLocationDto) implements IUpdateLocationDto {}
