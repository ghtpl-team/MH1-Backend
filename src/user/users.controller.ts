import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() userData: CreateUserDto,
  ): Promise<Pick<User, 'id' | 'phone' | 'status'>> {
    return this.usersService.create(userData);
  }

  @Get('all')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get()
  async find(@Query('userId') userId: string) {
    return this.usersService.find(parseInt(userId));
  }

  @Get('info/form')
  async getInfoForm() {
    return this.usersService.fetchUserInfoForm();
  }
}
