import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates a given JWT token.
   *
   * @param token - The JWT token to be validated.
   * @returns The payload of the token if valid, otherwise returns null.
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findOneByPhoneNumber(
        payload.phoneNumber,
      );
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Logs in an existing user or creates a new user based on the provided phone number.
   *
   * @param phoneNumber - The phone number of the user to log in or create.
   * @returns A promise that resolves to the user object, either found or newly created.
   */
  async loginOrCreate(phoneNumber: string): Promise<any> {
    let user = await this.userService.findOneByPhoneNumber(phoneNumber);
    if (!user) {
      user = await this.userService.create({ phone: phoneNumber });
    }
    return user;
  }
}
