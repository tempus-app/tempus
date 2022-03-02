export interface HandleBarHelper {
	helperName: string;
	helper: (...args: never) => string;
}

export interface PdfTemplateDtoInterface<T> {
	filename: string;
	template: string;
	data: T;
	handlebarsHelpers?: HandleBarHelper[];
}
