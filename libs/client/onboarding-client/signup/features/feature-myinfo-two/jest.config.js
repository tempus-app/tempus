module.exports = {
	displayName: 'onboarding-client-signup-feature-myinfo-two',
	preset: '../../../../../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
			stringifyContentPathRegex: '\\.(html|svg)$',
		},
	},
	coverageDirectory: '../../../../../../coverage/libs/client/onboarding-client/signup/features/feature-myinfo-two',
	transform: {
		'^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
	},
	transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
	snapshotSerializers: [
		'jest-preset-angular/build/serializers/no-ng-attributes',
		'jest-preset-angular/build/serializers/ng-snapshot',
		'jest-preset-angular/build/serializers/html-comment',
	],
};
