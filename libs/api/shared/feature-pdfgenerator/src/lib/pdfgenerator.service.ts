import { Injectable, Response } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { HandleBarHelper, PdfTemplateDtoInterface, ResumePdfTemplateDto } from '@tempus/api/shared/dto';
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
		const templateHtml = fs.readFileSync(
			path.join(path.resolve(`${__dirname}/assets/templates/pdf`), `./${pdfData.template}.hbs`),
			'utf8',
		);

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
			printBackground: true,
			displayHeaderFooter: true,
			headerTemplate: '<div></div>',
			footerTemplate: `
				<div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
					padding: 5px 5px 0; color: #bbb; position: relative;">
					<div style="position: absolute; left: 5px; top: 5px;">Property of CAL and Associates.</span></div>
					<div style="position: absolute; right: 5px; top: 5px;">Page <span class="pageNumber"></span>/<span class="totalPages"></span></div>
				</div>
			`,
			margin: { bottom: '0.5in', top: '0.5in', left: '0.5in', right: '0.5in' },
		};

		// start headless browser
		const browser = await puppeteer.launch({
			executablePath: this.configService.get('chromiumPath') || null,
			args: ['--no-sandbox'],
			headless: true,
		});

		// go to blank page
		const page = await browser.newPage();
		await page.setViewport({ width: 794, height: 1122, deviceScaleFactor: 2 });

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
