import { Injectable, Response } from '@nestjs/common'
import * as puppeteer from 'puppeteer'
import * as path from 'path'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
import { PdfTemplateDto, HandleBarHelper, ResumePdfTemplateDto } from '@tempus/datalayer'
import { SampleView } from './testdata/sampleView'

@Injectable()
export class PdfGeneratorService {
  constructor() {}

  async createPDF(
    @Response() res,
    templateData?: PdfTemplateDto<any>,
    pdfOptions?: puppeteer.PDFOptions,
    attach?: boolean
  ): Promise<void> {
    let pdfData: PdfTemplateDto<any> = templateData ? templateData : new ResumePdfTemplateDto('testresume', SampleView)

    // reading template file from file system
    let templateHtml = fs.readFileSync(
      path.join('./libs/pdfgenerator/src/lib/templates/', `./${pdfData.template}.hbs`),
      'utf8'
    )

    //attaching any helper functions as provided in the template data input
    pdfData.handlebarsHelpers.forEach((handlebarHelper: HandleBarHelper) => {
      handlebars.registerHelper(`${handlebarHelper.helperName}`, handlebarHelper.helper)
    })

    // compiling template into html with injected data
    let template = handlebars.compile(templateHtml)
    let html = template(pdfData.data)

    // basic pdf options
    let options = pdfOptions
      ? pdfOptions
      : {
          format: 'a4',
          margin: {
            top: '1in',
            bottom: '1in',
            left: '1in',
            right: '1in',
          },
          printBackground: true,
        }

    // start headless browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    })

    // go to blank page
    let page = await browser.newPage()

    // pass compiled html data into the newly created page
    // wait until external dependencies are loaded
    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
      waitUntil: 'networkidle0',
    })

    // @ts-ignore
    const buffer = await page.pdf(options)
    await browser.close()

    // specify headers so browser knows how to handle the data
    // 'inline' opens the pdf in the tab. if auto download needed, use 'attachment'
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${attach ? 'attachment' : 'inline'}; filename=example.pdf`,
      'Content-Length': buffer.length,
    })

    // writing bytestream to response
    res.end(buffer)
  }
}
