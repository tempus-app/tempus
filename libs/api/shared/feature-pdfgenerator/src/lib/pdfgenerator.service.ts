import { Injectable, Response } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { PdfTemplateDtoInterface, HandleBarHelper, ResumePdfTemplateDto } from '@tempus/shared-domain';
import { ConfigService } from '@nestjs/config';
import { SampleView } from './testdata/sampleView';

@Injectable()
export class PdfGeneratorService {
	constructor(private configService: ConfigService) {}

	async createPDF(
		@Response() res,
		templateData?: PdfTemplateDtoInterface,
		pdfOptions?: puppeteer.PDFOptions,
		attach?: boolean,
	): Promise<void> {
		const pdfData: PdfTemplateDtoInterface = templateData || new ResumePdfTemplateDto('testresume', SampleView);

		// reading template file from file system
		const templateHtml = fs.readFileSync(path.join('/assets/templates/pdf', `./${pdfData.template}.hbs`), 'utf8');

		// attaching any helper functions as provided in the template data input
		pdfData.handlebarsHelpers.forEach((handlebarHelper: HandleBarHelper) => {
			handlebars.registerHelper(`${handlebarHelper.helperName}`, handlebarHelper.helper);
		});

		// compiling template into html with injected data
		const template = handlebars.compile(templateHtml);
		const html = template(pdfData.data);

		// basic pdf options
		const options = pdfOptions || {
			format: 'a4',
			margin: {
				top: '1in',
				bottom: '1in',
				left: '1in',
				right: '1in',
			},
			printBackground: true,
		};

		// start headless browser
		const browser = await puppeteer.launch({
			executablePath: this.configService.get('chromiumPath') || null,
			args: ['--no-sandbox'],
			headless: true,
		});

		// go to blank page
		const page = await browser.newPage();

		// pass compiled html data into the newly created page
		// wait until external dependencies are loaded
		await page.goto(`data:text/html;charset=UTF-8,${html}`, {
			waitUntil: 'networkidle0',
		});

		const buffer = await page.pdf(options);
		await browser.close();

		// specify headers so browser knows how to handle the data
		// 'inline' opens the pdf in the tab. if auto download needed, use 'attachment'
		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': `${attach ? 'attachment' : 'inline'}; filename=${pdfData.filename}.pdf`,
			'Content-Length': buffer.length,
		});

		// writing bytestream to response
		res.end(buffer);
	}
}
