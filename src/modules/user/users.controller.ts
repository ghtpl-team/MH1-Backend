import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { User } from 'src/entities/user.entity';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(CustomAuthGuard)
  @Post()
  async create(
    @Body() userData: CreateUserDto,
  ): Promise<Pick<User, 'id' | 'phone' | 'status'>> {
    return this.usersService.create(userData);
  }

  @UseGuards(CustomAuthGuard)
  @Get('all')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(CustomAuthGuard)
  @Get()
  async find(@Headers('x-mh-v3-user-id') userId: string) {
    return this.usersService.find(parseInt(userId));
  }

  @UseGuards(CustomAuthGuard)
  @Get('info/form')
  async getInfoForm() {
    return this.usersService.fetchUserInfoForm();
  }
}
