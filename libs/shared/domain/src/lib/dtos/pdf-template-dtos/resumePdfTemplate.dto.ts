import { HandleBarHelper } from '.';
import { View } from '../../models';
import { PdfTemplateDtoInterface } from './pdfTemplateInterface.dto';

const formatDateHelper: HandleBarHelper = {
	helperName: 'formatdate',
	helper: (date: Date) => {
		return `${date.toLocaleDateString('default', { month: 'short' })} ${date.getFullYear()}`.toString();
	},
};
const lastNameHelper: HandleBarHelper = {
	helperName: 'lastname',
	helper: (lastname: string) => {
		return `${lastname[0]}.`;
	},
};
const atleastOne: HandleBarHelper = {
	helperName: 'atleastone',
	helper: (data: [], summary: string) => {
		return data?.length > 0 || summary?.length > 0;
	},
};

export class ResumePdfTemplateDto implements PdfTemplateDtoInterface {
	filename: string;

	template = 'resume';

	data: View;

	handlebarsHelpers: HandleBarHelper[] = [formatDateHelper, lastNameHelper, atleastOne];

	constructor(filename: string, data: View) {
		this.filename = filename;
		this.data = data;
	}
}
