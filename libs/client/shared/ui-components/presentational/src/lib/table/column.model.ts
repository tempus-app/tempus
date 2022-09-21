export interface Column {
	columnDef: string;
	header: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	cell: Function;
	icon?: {
		val: string;
		class: string;
	};
	url?: string;
}
