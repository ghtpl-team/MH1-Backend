import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JournalsModule } from './journals/journals.module';
import { KickCounterModule } from './kick-counter/kick-counter.module';
import { MedicationSchedulesModule } from './medication-schedules/medication-schedules.module';
import config from './mikro-orm.config';
import { SubscriptionPageModule } from './subscription-page/subscription-page.module';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';
import { UsersModule } from './user/users.module';
import { WeeklyInsightsModule } from './weekly-insights/weekly-insights.module';
import { UnsubscribedHomeModule } from './unsubscribed-home/unsubscribed-home.module';
import { NewsCardsModule } from './news-cards/news-cards.module';
import { SymptomsModule } from './symptoms/symptoms.module';
import { ActivitiesModule } from './activities/activities.module';
import { SchedulesModule } from './schedules/schedules.module';
import { DietPlansModule } from './diet-plans/diet-plans.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './utils/exceptions-logger/exceptions-logger.filter';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(config),
    UsersModule,
    MedicationSchedulesModule,
    UserPreferencesModule,
    JournalsModule,
    KickCounterModule,
    WeeklyInsightsModule,
    SubscriptionPageModule,
    UnsubscribedHomeModule,
    NewsCardsModule,
    SymptomsModule,
    ActivitiesModule,
    SchedulesModule,
    DietPlansModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
  ],
})
export class AppModule {}
