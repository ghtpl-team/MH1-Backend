import { Body, Controller, Post, Req } from '@nestjs/common';
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
  ) {
    const userId = parseInt(req.headers['x-mh-user-id']);
    return this.userPreferencesService.create(userPreferencesDto, userId);
  }
}
