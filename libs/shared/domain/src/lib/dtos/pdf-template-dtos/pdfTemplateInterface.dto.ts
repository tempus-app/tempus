export interface HandleBarHelper {
	helperName: string;
	helper: (...args: never) => string | boolean;
}

export interface PdfTemplateDtoInterface {
	filename: string;
	template: string;
	data: unknown;
	handlebarsHelpers?: HandleBarHelper[];
}
