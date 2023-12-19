const settings = {
	clientId: process.env.CLIENT_ID?.toString(),
	clientSecret: process.env.CLIENT_SECRET?.toString(),
	tenantId: process.env.TENANT_ID?.toString(),
	domain: process.env.AZURE_DOMAIN?.toString(),
	authTenant: 'common',
};

export interface AppSettings {
	clientId: string;
	clientSecret: string;
	tenantId: string;
	domain: string;
	authTenant: string;
}

export default settings;
