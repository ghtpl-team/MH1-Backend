import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('user-preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Patch()
  @UseGuards(CustomAuthGuard)
  async setUserPreferences(
    @Headers('x-mh-v3-user-id') userId: string,
    @Body() userPreferencesDto: UserPreferencesDto,
  ) {
    if (!userId) {
      throw new HttpException('user id is required!', HttpStatus.BAD_REQUEST);
    }
    return this.userPreferencesService.update(
      userPreferencesDto,
      parseInt(userId),
    );
  }
}
