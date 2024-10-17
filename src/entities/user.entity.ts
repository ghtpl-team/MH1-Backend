import {
  Entity,
  Index,
  Property,
  OneToMany,
  Collection,
  OneToOne,
  BeforeCreate,
  BeforeUpdate,
  BeforeUpsert,
} from '@mikro-orm/core';
import { ActivityFeedBack } from './activity-feedback.entity';
import { BaseClass } from './base.entity';
import { JournalNotes } from './journal-notes.entity';
import { LoggedSymptoms } from './logged_symptoms';
import { MedicationSchedule } from './medication-schedule.entity';
import { ScheduledTask } from './scheduled-tasks.entity';
import { Schedule } from './schedules.entity';
import { Subscriptions } from './subscriptions.entity';
import { UserPreferences } from './user-preferences.entity';
import { UserProfile } from './user-profile.entity';
import { MedicalRecord } from './medical-records.entity';
import { BookmarkedArticle } from './bookmarked-articles.entity';
import { RewardPointsAggregate } from './reward-point-aggregation.entity';
import { UserComment } from './user-comments.entity';
import { SubscriptionUsage } from './subscription-usage.entity';

@Entity({ tableName: 'mh_users' })
export class User extends BaseClass {
  @Index()
  @Property({ unique: true })
  phone!: string;

  @Index()
  @Property({ unique: true })
  deviceId!: string;

  @Index()
  @Property({ nullable: true })
  mongoId: string;

  @Property({ type: 'date' })
  expectedDueDate!: string;

  @OneToMany(() => MedicationSchedule, (schedule) => schedule.user)
  medicationSchedules = new Collection<MedicationSchedule>(this);

  @OneToMany(() => ActivityFeedBack, (feedback) => feedback.user)
  activityFeedbacks = new Collection<ActivityFeedBack>(this);

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules = new Collection<Schedule>(this);

  @OneToMany(() => ScheduledTask, (scheduleTask) => scheduleTask.user)
  scheduledTasks = new Collection<Schedule>(this);

  @OneToOne(() => UserPreferences, (userPreferences) => userPreferences.user, {
    orphanRemoval: true,
    cascade: [],
    fieldName: 'user_preference_id',
  })
  userPreferences = new UserPreferences();

  @OneToMany(
    () => RewardPointsAggregate,
    (rewardPointsAggregate) => rewardPointsAggregate.user,
  )
  rewardPointsAggregate = new Collection<RewardPointsAggregate>(this);

  @OneToMany(() => JournalNotes, (journalNotes) => journalNotes.user, {
    orphanRemoval: true,
  })
  journalNotes = new Collection<JournalNotes>(this);

  @OneToMany(() => LoggedSymptoms, (logSymptom) => logSymptom.user)
  loggedSymptoms = new Collection<LoggedSymptoms>(this);

  @OneToMany(() => Subscriptions, (subscription) => subscription.user)
  subscription = new Collection<Subscriptions>(this);

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    nullable: true,
  })
  userProfile?: UserProfile;

  @OneToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.user, {
    nullable: true,
  })
  medicalRecord?: MedicalRecord;

  @OneToMany(
    () => BookmarkedArticle,
    (bookmarkedArticle) => bookmarkedArticle.user,
  )
  bookmarkedArticles = new Collection<BookmarkedArticle>(this);

  @OneToMany(() => UserComment, 'user')
  userComments = new Collection<UserComment>(this);

  @OneToOne(
    () => SubscriptionUsage,
    (subscriptionUsage) => subscriptionUsage.user,
  )
  subscriptionUsage: SubscriptionUsage = new SubscriptionUsage();

  @BeforeCreate()
  @BeforeUpdate()
  @BeforeUpsert()
  setDefaultEDD() {
    if (!this.expectedDueDate || this.expectedDueDate === '') {
      this.expectedDueDate = '1990-10-02';
    }
  }
}
