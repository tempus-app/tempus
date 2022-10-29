import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger('HTTP');

	use(req: Request, res: Response, next: NextFunction) {
		const start = process.hrtime.bigint();

		res.on('finish', () => {
			const { method, originalUrl, hostname } = req;
			const { statusCode, statusMessage } = res;
			const end = process.hrtime.bigint();
			const responseTime = (end - start) / BigInt(1000000);

			const message = `REQUEST FROM: ${hostname} ${method} ${originalUrl} ${statusCode} ${statusMessage} - RESPONSE TIME: ${responseTime}ms`;

			return this.logger.log(message);
		});

		next();
	}
}
