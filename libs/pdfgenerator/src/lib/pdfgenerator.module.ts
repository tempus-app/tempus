import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@tempus/core';
import { PdfGeneratorService } from './pdfgenerator.service';

@Module({
	imports: [ConfigModule, CoreModule],
	controllers: [],
	providers: [PdfGeneratorService],
	exports: [PdfGeneratorService],
})
export class PdfgeneratorModule {}
