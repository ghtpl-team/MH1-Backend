import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesDto } from './dto/user-preferences.dto';

@Controller('user-preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Patch()
  async setUserPreferences(
    @Query('userId') userId: string,
    @Query('preferencesId') preferencesId: string,
    @Body() userPreferencesDto: UserPreferencesDto,
  ) {
    if (!userId || !preferencesId) {
      throw new HttpException('user id is required!', HttpStatus.BAD_REQUEST);
    }
    return this.userPreferencesService.update(
      userPreferencesDto,
      parseInt(userId),
      parseInt(preferencesId),
    );
  }
}
