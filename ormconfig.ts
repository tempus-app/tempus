import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {
	LinkEntity,
	ResourceEntity,
	UserEntity,
	LocationEntity,
	CertificationEntity,
	EducationEntity,
	ExperienceEntity,
	RevisionEntity,
	SkillEntity,
	SkillTypeEntity,
	ViewEntity,
	ClientEntity,
	ProjectEntity,
	ClientRepresentativeEntity,
	ProjectResourceEntity,
	PasswordResetEntity,
	CalendarEntity,
	TimesheetEntity,
	RevisedTimesheetEntity,
	ApprovalEntity,
	ReportEntity,
} from '@tempus/api/shared/entity';

const config: PostgresConnectionOptions = {
	type: 'postgres',
	host: process.env.DB_HOST != undefined ? process.env.DB_HOST.toString() : "cal-tempus.postgres.database.azure.com",
	port: parseInt(process.env.DB_PORT || "5432", 10),
	
	username: process.env.DB_USERNAME != undefined ? process.env.DB_USERNAME.toString() : "postgres",
	password: process.env.DB_PASSWORD != undefined ? process.env.DB_PASSWORD.toString() : "pTWZ9jW6w2pksQ",
	database: process.env.DB_NAME != undefined ? process.env.DB_NAME?.toString() : "postgres",
	entities: [
		UserEntity,
		ResourceEntity,
		LinkEntity,
		ViewEntity,
		EducationEntity,
		SkillEntity,
		ExperienceEntity,
		RevisionEntity,
		SkillTypeEntity,
		ClientEntity,
		ProjectEntity,
		LocationEntity,
		CertificationEntity,
		ClientRepresentativeEntity,
		ProjectResourceEntity,
		PasswordResetEntity,
		CalendarEntity,
		TimesheetEntity,
		RevisedTimesheetEntity,
		ReportEntity,
		ApprovalEntity,
	],
	synchronize: true,
	migrations: [`${__dirname}/dist/apps/onboarding-api/migrations/**/*.ts`],
	migrationsRun: true,
	cli: {
		migrationsDir: './migrations',
	},
};

export default config;
