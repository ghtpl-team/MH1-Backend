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
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3Mjc5NDMyNDUsImV4cCI6MTc1OTQ3OTQ3MSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInBob25lTnVtYmVyIjoiOTM1MjE3ODk2MSJ9.7h7CMMG1okkmbnOafGy53_WwOcVIFcyCQLo4OyNbV0w' ||
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
