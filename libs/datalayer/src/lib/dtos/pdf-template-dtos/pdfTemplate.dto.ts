export interface HandleBarHelper {
  helperName: string
  helper: (...args: any) => string
}

export interface PdfTemplateDto<T> {
  filename: string
  template: string
  data: T
  handlebarsHelpers?: HandleBarHelper[]
}
