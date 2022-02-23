import { View } from '../../models'
import { PdfTemplateDto } from './pdfTemplate.dto'

export class ResumePdfTemplateDto implements PdfTemplateDto<View> {
  template: 'resume'
  data: View
}
