import { Module } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
	controllers: [],
	providers: [LoggerMiddleware],
	exports: [LoggerMiddleware],
})
export class ApiSharedLoggingModule {}
