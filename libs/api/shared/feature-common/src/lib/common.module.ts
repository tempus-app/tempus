import { Module } from '@nestjs/common';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonService } from './common.service';

@Module({
	imports: [ApiSharedEntityModule],
	controllers: [],
	providers: [CommonService],
	exports: [CommonService],
})
export class CommonModule {}
