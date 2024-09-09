import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesDto } from './dto/user-preferences.dto';

@Controller('user-preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Post()
  async setUserPreferences(
    @Query('userId') userId: string,
    @Body() userPreferencesDto: UserPreferencesDto,
  ) {
    if (!userId) {
      throw new HttpException('user id is required!', HttpStatus.BAD_REQUEST);
    }
    return this.userPreferencesService.create(
      userPreferencesDto,
      parseInt(userId),
    );
  }
}
