import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { UsersModule } from './user/users.module';
import { MedicationSchedulesModule } from './medication-schedules/medication-schedules.module';
import { RemindersModule } from './reminders/reminders.module';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';
import { JournalsModule } from './journals/journals.module';
import { KickCounterModule } from './kick-counter/kick-counter.module';

@Module({
  imports: [MikroOrmModule.forRoot(config), UsersModule, MedicationSchedulesModule, RemindersModule, UserPreferencesModule, JournalsModule, KickCounterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
