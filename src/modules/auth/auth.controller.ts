import { Request, Response } from 'express'; // Ensure you import from 'express'
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/users.dto';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
    },
  ])
  async logIn(
    @Req() request: Request,
    @Body() userData: CreateUserDto,
    @Res() response: Response,
  ) {
    const v1Token = request.headers['authorization'];

    const cookie = await this.authService.getNewTokenWithJwtToken(
      v1Token,
      userData,
    );
    return response.json({ success: true, mh1Token: cookie });
  }
}
