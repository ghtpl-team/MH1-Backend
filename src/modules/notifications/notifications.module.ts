import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';
import { MoEngageModule } from 'src/utils/moengage/moengage.module';
import { UsersModule } from '../user/users.module';

@Module({
  providers: [NotificationsService],
  imports: [DayjsModule, MoEngageModule, UsersModule],
})
export class NotificationsModule {}
