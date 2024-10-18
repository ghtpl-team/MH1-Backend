import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../user/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomStrategy } from './custom.strategy';
import { CustomAuthGuard } from './custom-auth.guard';
import { StaticAuthGuard } from './static-auth.guard';
import { StaticStrategy } from './static.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: new ConfigService().get('JWT_SECRET'),
      signOptions: {
        expiresIn: 86400 * 365 * 2000,
        issuer: 'Motherhood One',
      },
      verifyOptions: {
        issuer: 'Motherhood One',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CustomStrategy,
    CustomAuthGuard,
    StaticStrategy,
    StaticAuthGuard,
  ],
  exports: [AuthService, CustomAuthGuard, StaticAuthGuard],
})
export class AuthModule {}
