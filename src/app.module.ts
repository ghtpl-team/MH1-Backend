import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JournalsModule } from './modules/journals/journals.module';
import { KickCounterModule } from './modules/kick-counter/kick-counter.module';
import { MedicationSchedulesModule } from './modules/medication-schedules/medication-schedules.module';
import config from './mikro-orm.config';
import { SubscriptionPageModule } from './modules/subscription-page/subscription-page.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
import { UsersModule } from './modules/user/users.module';
import { WeeklyInsightsModule } from './modules/weekly-insights/weekly-insights.module';
import { UnsubscribedHomeModule } from './modules/unsubscribed-home/unsubscribed-home.module';
import { NewsCardsModule } from './modules/news-cards/news-cards.module';
import { SymptomsModule } from './modules/symptoms/symptoms.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { DietPlansModule } from './modules/diet-plans/diet-plans.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { RazorpayModule } from './utils/razorpay/razorpay.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './modules/subscriptions/subscription.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './utils/exceptions-logger/exceptions-logger.filter';
import { ArticlesModule } from './modules/articles/articles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppHealthModule } from './app-health/app-health.module';
import { DayjsModule } from './utils/dayjs/dayjs.module';
import { MediaModule } from './modules/media/media.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsInterceptor } from './interceptors/metrics.interceptor';
import { RequestContextModule } from './common/request-context/request-context.module';
import { RequestContextMiddleware } from './middlewares/request.context.middleware';
import { TimezoneModule } from './common/timezone/timezone.module';
import { AuthModule } from './modules/auth/auth.module';
import { RewardPointsModule } from './modules/reward-points/reward-points.module';
import { PostsModule } from './modules/posts/posts.module';
import { AxiosModule } from './utils/axios/axios.module';
import { MoEngageModule } from './utils/moengage/moengage.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { IapModule } from './utils/iap/iap.module';

@Module({
  imports: [
    PrometheusModule.register({}),
    ScheduleModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
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
    WebhooksModule,
    RazorpayModule,
    SubscriptionModule,
    ArticlesModule,
    AppHealthModule,
    DayjsModule,
    MediaModule,
    RequestContextModule,
    TimezoneModule,
    AuthModule,
    RewardPointsModule,
    PostsModule,
    AxiosModule,
    MoEngageModule,
    NotificationsModule,
    IapModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*'); // FIXME: either make interceptor global or apply middle ware on selected routes
  }
}
