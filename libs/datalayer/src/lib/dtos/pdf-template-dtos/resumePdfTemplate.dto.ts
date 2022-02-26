import { HandleBarHelper } from '.'
import { View } from '../../models'
import { PdfTemplateDto } from './pdfTemplate.dto'

const handlebarHelper: HandleBarHelper = {
  helperName: 'formatdate',
  helper: (date: Date) => {
    return (date.toLocaleDateString('default', { month: 'short' }) + ' ' + date.getFullYear()).toString()
  },
}

export class ResumePdfTemplateDto implements PdfTemplateDto<View> {
  filename: string
  template: string = 'resume'
  data: View
  handlebarsHelpers: HandleBarHelper[] = [handlebarHelper]

  constructor(filename: string, data: View) {
    this.filename = filename
    this.data = data
  }
}
