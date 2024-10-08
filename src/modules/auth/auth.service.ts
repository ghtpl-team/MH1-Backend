import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getCookieWithJwtToken(v1Token: string) {
    const { deviceId } = this.jwtService.verify(v1Token);
    const payload = await this.loginOrCreate(deviceId);
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${8400 * 365 * 2000}`;
  }

  /**
   * Validates a given JWT token.
   *
   * @param token - The JWT token to be validated.
   * @returns The payload of the token if valid, otherwise returns null.
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.decode(token, {});
      console.log(payload);

      const user = await this.loginOrCreate(payload.deviceId);
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
  async loginOrCreate(deviceId: string): Promise<any> {
    let user = await this.userService.findOneByDeviceId(deviceId);

    if (!user) {
      user = await this.userService.create({
        deviceId,
        phone: '9352178961',
        expectedDueDate: '2025-05-30',
        mongoId: '1234567890',
      });
    }
    console.log(user);

    return user;
  }
}
