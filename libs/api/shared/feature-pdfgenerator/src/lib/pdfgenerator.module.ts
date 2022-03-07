import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PdfGeneratorService } from './pdfgenerator.service';

@Module({
	imports: [ConfigModule],
	controllers: [],
	providers: [PdfGeneratorService],
	exports: [PdfGeneratorService],
})
export class PdfgeneratorModule {}
