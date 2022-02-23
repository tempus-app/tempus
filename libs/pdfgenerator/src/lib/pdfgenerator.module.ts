import { Module } from '@nestjs/common'
import { PdfGeneratorService } from './pdfgenerator.service'

@Module({
  controllers: [],
  providers: [PdfGeneratorService],
  exports: [PdfGeneratorService],
})
export class PdfgeneratorModule {}
