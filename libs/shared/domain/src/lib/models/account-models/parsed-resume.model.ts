export type ParsedEmail = {
	value: string;
	canonical: string;
};

export type ParsedLocation = {
	name: string;
	address: {
		CountryCode: string;
	};
};

export type ParsedPhones = {
	value: string;
	type: string;
};

export type ParsedWorkExperience = {
	start?: {
		year: number;
		month: number;
		timestamp: number;
	};
	end?: {
		year: number;
		month: number;
		timestamp: number;
	};
	isCurrent: boolean;
	org: string;
	title: string;
};

export type ParsedEducation = {
	degree: string;
	org: string;
	summary: string;
	start?: {
		year: number;
		month: number;
		timestamp: number;
	};
	end?: {
		year: number;
		month: number;
		timestamp: number;
	};
};

export type ParsedSummary = {
	executiveSummary: string;
	skills: string;
};

export type ParsedResume = {
	createdAt: number;
	emails: Array<ParsedEmail>;
	links: Array<string>;
	location: ParsedLocation;
	name: string;
	mobile_number: string;
	skills: string[];
	experience: Array<ParsedWorkExperience>;
	summary: ParsedSummary;
	degree: string;
};

export type RawResume = {
	body: string;
};
