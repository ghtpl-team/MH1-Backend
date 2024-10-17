import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getNewTokenWithJwtToken(v1Token: string, reqBody: CreateUserDto) {
    const { payload } = this.jwtService.decode(v1Token);

    const userPayload = await this.loginOrCreate(
      payload.deviceId,
      payload.mobileNumber,
      reqBody,
    );

    const token = this.jwtService.sign(userPayload, {
      secret: process.env.JWT_SECRET,
    });
    return token;
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
      if (!payload) {
        return null;
      }
      return payload;
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
  async loginOrCreate(
    deviceId: string,
    mobileNumber: string,
    userData: CreateUserDto,
  ): Promise<any> {
    let user = await this.userService.findOneByPhoneNumber(mobileNumber);

    if (!user) {
      user = await this.userService.create({
        deviceId,
        phone: mobileNumber,
        expectedDueDate: userData.expectedDueDate,
        mongoId: userData?.mongoId,
      });
    }

    await this.userService.upsert(user.id, userData);

    return user;
  }
}
