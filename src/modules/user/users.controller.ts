import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SubscriptionUsageUpdateDto } from './dto/users.dto';
import { User } from 'src/entities/user.entity';
import { CustomAuthGuard } from '../auth/custom-auth.guard';
import { ApiHeader } from '@nestjs/swagger';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly subscriptionService: SubscriptionsService,
  ) {}

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
  @ApiHeader({
    name: 'x-mh-v3-user-id',
    description: 'User ID',
    required: false,
  })
  async find(@Headers('x-mh-v3-user-id') userId: string) {
    return this.usersService.find(parseInt(userId));
  }

  @UseGuards(CustomAuthGuard)
  @Get('info/form')
  async getInfoForm() {
    return this.usersService.fetchUserInfoForm();
  }

  @UseGuards(CustomAuthGuard)
  @Patch('free-bookings')
  async updateFreeBookingsUsage(
    @Headers('x-mh-v3-user-id') userId: string,
    @Body() updateUsageDto: SubscriptionUsageUpdateDto,
  ) {
    return this.subscriptionService.updateUsage(
      parseInt(userId),
      updateUsageDto,
    );
  }

  @UseGuards(CustomAuthGuard)
  @Get('free-bookings')
  async getFreeBookingsUsage(@Headers('x-mh-v3-user-id') userId: string) {
    return this.usersService.getSubscriptionUsageDetails(parseInt(userId));
  }
}
