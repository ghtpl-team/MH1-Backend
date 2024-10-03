import {
  Body,
  Controller,
  Get,
  Post,
  Request,
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
  async find(@Request() req) {
    const user = req.user;
    return this.usersService.find(parseInt(user.id));
  }

  @UseGuards(CustomAuthGuard)
  @Get('info/form')
  async getInfoForm() {
    return this.usersService.fetchUserInfoForm();
  }
}
