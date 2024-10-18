// auth/custom.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from './auth.service';

@Injectable()
export class StaticStrategy extends PassportStrategy(Strategy, 'static') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const isAuthenticated = await this.authService.validateToken(token);

    if (!isAuthenticated) {
      throw new UnauthorizedException('Invalid token');
    }

    return isAuthenticated;
  }
}
