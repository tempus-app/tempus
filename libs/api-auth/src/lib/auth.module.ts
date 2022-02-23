import { forwardRef, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AccountModule } from '@tempus/api-account'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { ConfigModule } from '@nestjs/config'
import { CoreModule } from '@tempus/core'
import { RolesGuard } from './guards/roles.guard'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    forwardRef(() => AccountModule),
    PassportModule,
    CoreModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '900s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalAuthGuard, JwtAuthGuard],
  exports: [LocalAuthGuard, JwtAuthGuard],
})
export class AuthModule {}
