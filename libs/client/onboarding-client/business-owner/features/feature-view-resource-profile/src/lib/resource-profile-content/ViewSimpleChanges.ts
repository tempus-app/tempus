// Used to extend the Simple Changes interface so typescript doesn't complain that simple changes does not have values that are found in the View Model
// For example, profileSummary, experienceSummary, etc are not part of the simple change object so extending the interface fixes the complaints
// Taken from https://stackoverflow.com/questions/44161550/type-checking-for-simplechanges-interface-in-ngonchanges-hook
export type ComponentChange<T, P extends keyof T> = {
	previousValue: T[P];
	currentValue: T[P];
	firstChange: boolean;
};

export type ComponentChanges<T> = {
	[P in keyof T]?: ComponentChange<T, P>;
};
