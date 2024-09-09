import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
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
    @Body() userPreferencesDto: UserPreferencesDto,
    @Req() req: Request,
    @Query() userId: string,
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
