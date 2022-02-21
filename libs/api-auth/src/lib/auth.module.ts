import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AccountModule } from '@tempus/api-account'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { LocalStrategy } from './local.strategy'

@Module({
  imports: [AccountModule, PassportModule],
  controllers: [],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
  exports: [],
})
export class AuthModule {}
