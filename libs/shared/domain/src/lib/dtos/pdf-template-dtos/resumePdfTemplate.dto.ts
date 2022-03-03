import { HandleBarHelper } from '.';
import { View } from '../../models';
import { PdfTemplateDtoInterface } from './pdfTemplateInterface.dto';

const handlebarHelper: HandleBarHelper = {
	helperName: 'formatdate',
	helper: (date: Date) => {
		return `${date.toLocaleDateString('default', { month: 'short' })} ${date.getFullYear()}`.toString();
	},
};

export class ResumePdfTemplateDto implements PdfTemplateDtoInterface {
	filename: string;

	template = 'resume';

	data: View;

	handlebarsHelpers: HandleBarHelper[] = [handlebarHelper];

	constructor(filename: string, data: View) {
		this.filename = filename;
		this.data = data;
	}
}
