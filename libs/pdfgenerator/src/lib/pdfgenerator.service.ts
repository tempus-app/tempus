import { Injectable, Response } from '@nestjs/common'
import * as puppeteer from 'puppeteer'
import * as path from 'path'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
import { PdfTemplateDto } from '@tempus/datalayer'

@Injectable()
export class PdfGeneratorService {
  constructor() {}

  async createPDF(
    @Response() res,
    templateData?: PdfTemplateDto<any>,
    pdfOptions?: puppeteer.PDFOptions
  ): Promise<void> {
    let pdfData = templateData ? templateData : { template: 'resume', data: { name: 'mustafa' } }

    // compiling template into html with injected data
    let templateHtml = fs.readFileSync(
      path.join('./libs/pdfgenerator/src/lib/templates/', `./${pdfData.template}.html`),
      'utf8'
    )
    let template = handlebars.compile(templateHtml)
    let html = template(pdfData.data)

    // basic pdf options
    let options = pdfOptions
      ? pdfOptions
      : {
          format: 'a4',
          margin: {
            top: '10px',
            bottom: '10px',
            left: '10px',
            right: '10px',
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
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,
    })

    // writing bytestream to response
    res.end(buffer)
  }
}
