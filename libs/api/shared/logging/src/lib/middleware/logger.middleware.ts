import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger('HTTP');

	start = process.hrtime.bigint();

	use(req: Request, res: Response, next: NextFunction) {
		res.on('finish', () => {
			const { method, originalUrl, hostname } = req;
			const { statusCode, statusMessage } = res;
			const end = process.hrtime.bigint();
			const responseTime = (end - this.start) / BigInt(1000000);

			const message = `REQUEST FROM: ${hostname} ${method} ${originalUrl} ${statusCode} ${statusMessage} - RESPONSE TIME: ${responseTime}ms`;

			return this.logger.log(message);
		});

		next();
	}
}
