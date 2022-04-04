export const configuration = () => ({
	environment: process.env.NODE_ENV,
	port: parseInt(process.env.PORT || '3000', 10),
	jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
	saltSecret: parseInt(process.env.SALT_SECRET),
	emailHost: process.env.EMAIL_HOST,
	emailPort: parseInt(process.env.EMAIL_PORT || '547', 10),
	emailUsername: process.env.EMAIL_USERNAME,
	emailPassword: process.env.EMAIL_PASSWORD,
	emailDefaultAddress: process.env.EMAIL_ADDRESS,
	apiUrl: process.env.API_URL,
	chromiumPath: process.env.CHROMIUM_PATH || null,
});
