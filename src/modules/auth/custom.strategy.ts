// auth/custom.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from './auth.service';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validates the authorization token from the request headers.
   *
   * @param req - The incoming request object containing headers.
   * @returns A promise that resolves to the user object if the token is valid.
   * @throws UnauthorizedException if the token is not found or invalid.
   */
  async validate(req: Request): Promise<any> {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNb3RoZXJob29kIE9uZSIsImlhdCI6MTcyODM4NTY3NSwiZXhwIjoxNzU5OTIxNjkzLCJhdWQiOiIiLCJzdWIiOiJtaDFfdXNlciIsImRldmljZUlkIjoiMTIzNDU2Nzg5In0.2Pzvs56qpDu2-TCUORJWpEEnVcLy2qjp7Ov5KSBwe2Y' ||
      req.headers['authorization']?.split(' ')[1]; //TODO: static need to change it
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const user = await this.authService.validateToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
