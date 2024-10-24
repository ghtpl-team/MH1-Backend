import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SubscriptionUsageUpdateDto } from './dto/users.dto';
import { User } from 'src/entities/user.entity';
import { CustomAuthGuard } from '../auth/custom-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { StaticAuthGuard } from '../auth/static-auth.guard';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
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

  @UseGuards(StaticAuthGuard)
  @Patch('free-bookings')
  async updateFreeBookingsUsage(
    @Query('mobileNumber') mobileNumber: string,
    @Body() updateUsageDto: SubscriptionUsageUpdateDto,
  ) {
    const user = await this.usersService.findOneByPhoneNumber(mobileNumber);
    return this.subscriptionService.updateUsage(user.id, updateUsageDto);
  }

  @UseGuards(StaticAuthGuard)
  @Get('free-bookings')
  async getFreeBookingsUsage(@Query('mobileNumber') mobileNumber: string) {
    const user = await this.usersService.findOneByPhoneNumber(mobileNumber);
    if (!user) {
      return {
        success: true,
        remainingFreeBookings: 0,
      };
    }
    return this.usersService.getSubscriptionUsageDetails(user.id);
  }
}
