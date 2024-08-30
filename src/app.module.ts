import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JournalsModule } from './journals/journals.module';
import { KickCounterModule } from './kick-counter/kick-counter.module';
import { MedicationSchedulesModule } from './medication-schedules/medication-schedules.module';
import config from './mikro-orm.config';
import { RemindersModule } from './reminders/reminders.module';
import { SubscriptionPageModule } from './subscription-page/subscription-page.module';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';
import { UsersModule } from './user/users.module';
import { WeeklyInsightsModule } from './weekly-insights/weekly-insights.module';
import { UnsubscribedHomeModule } from './unsubscribed-home/unsubscribed-home.module';
import { NewsCardsModule } from './news-cards/news-cards.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    UsersModule,
    MedicationSchedulesModule,
    RemindersModule,
    UserPreferencesModule,
    JournalsModule,
    KickCounterModule,
    WeeklyInsightsModule,
    SubscriptionPageModule,
    UnsubscribedHomeModule,
    NewsCardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
