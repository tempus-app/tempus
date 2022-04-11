import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule, CommonService } from '@tempus/api/shared/feature-common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Module({
	imports: [ApiSharedEntityModule, CommonModule, PassportModule, ConfigModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		JwtRefreshStrategy,
		LocalAuthGuard,
		JwtAuthGuard,
		JwtRefreshGuard,
		CommonService,
	],
	exports: [AuthService, LocalAuthGuard, JwtAuthGuard, JwtRefreshGuard],
})
export class AuthModule {}
