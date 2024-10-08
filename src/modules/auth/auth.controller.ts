import { Request, Response } from 'express'; // Ensure you import from 'express'
import { Controller, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async logIn(@Req() request: Request, @Res() response: Response) {
    const v1Token = request.headers['authorization']?.split(' ')[1];
    const cookie = await this.authService.getCookieWithJwtToken(v1Token);
    response.setHeader('Set-Cookie', cookie);
    return response.json({ msg: 'login successful' });
  }
}
