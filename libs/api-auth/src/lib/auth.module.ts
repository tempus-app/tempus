import { forwardRef, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AccountModule } from '@tempus/api-account'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { LocalStrategy } from './local.strategy'

@Module({
  imports: [forwardRef(() => AccountModule), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
  exports: [LocalAuthGuard],
})
export class AuthModule {}
