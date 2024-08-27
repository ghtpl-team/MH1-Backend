import { Migration } from '@mikro-orm/migrations';

export class Migration20240827160210 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table `mh_users` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `status` enum(\'active\', \'deleted\', \'archived\') not null default \'active\', `phone` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `mh_users` add index `mh_users_status_index`(`status`);');
    this.addSql('alter table `mh_users` add unique `mh_users_phone_unique`(`phone`);');

    this.addSql('create table `mh_medication_schedule` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `status` enum(\'active\', \'deleted\', \'archived\') not null default \'active\', `user_id` int unsigned not null, `medication_name` varchar(255) not null, `medication_type` enum(\'capsule\', \'liquid\', \'tablet\', \'topical\', \'cream\', \'device\', \'drops\', \'foam\', \'gel\', \'inhaler\', \'injection\', \'lotion\', \'ointment\', \'patch\', \'powder\', \'spray\', \'suppository\') not null, `strength` varchar(255) not null, `strength_unit` enum(\'mg\', \'mcg\', \'g\', \'ml\', \'percentage\') not null, `intake_type` enum(\'before_food\', \'after_food\') not null, `intake_time` json not null, `frequency` enum(\'daily\', \'every_other_day\', \'every_third_day\', \'every_fourth_day\', \'every_fifth_day\', \'specific_days\') not null, `selected_days` json null, `intake_times` json not null, `start_date` date not null, `end_date` date not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `mh_medication_schedule` add index `mh_medication_schedule_status_index`(`status`);');
    this.addSql('alter table `mh_medication_schedule` add index `mh_medication_schedule_user_id_index`(`user_id`);');
    this.addSql('alter table `mh_medication_schedule` add index `mh_medication_schedule_start_date_index`(`start_date`);');
    this.addSql('alter table `mh_medication_schedule` add index `mh_medication_schedule_end_date_index`(`end_date`);');
    this.addSql('alter table `mh_medication_schedule` add unique `mh_medication_schedule_user_id_medication_name_unique`(`user_id`, `medication_name`);');

    this.addSql('create table `mh_kick_counter` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `status` enum(\'active\', \'deleted\', \'archived\') not null default \'active\', `date` date not null, `start_time` time not null, `duration_in_sec` int not null, `kick_count` int not null, `user_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `mh_kick_counter` add index `mh_kick_counter_status_index`(`status`);');
    this.addSql('alter table `mh_kick_counter` add index `mh_kick_counter_date_index`(`date`);');
    this.addSql('alter table `mh_kick_counter` add index `mh_kick_counter_user_id_index`(`user_id`);');

    this.addSql('create table `mh_journal_security` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `status` enum(\'active\', \'deleted\', \'archived\') not null default \'active\', `user_id` int unsigned not null, `is_locked` tinyint(1) not null default false) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `mh_journal_security` add index `mh_journal_security_status_index`(`status`);');
    this.addSql('alter table `mh_journal_security` add unique `mh_journal_security_user_id_unique`(`user_id`);');

    this.addSql('create table `mh_journal_notes` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `status` enum(\'active\', \'deleted\', \'archived\') not null default \'active\', `user_id` int unsigned not null, `title` varchar(255) not null, `content` text not null, `date` date not null, `is_shared` tinyint(1) not null default false) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `mh_journal_notes` add index `mh_journal_notes_status_index`(`status`);');
    this.addSql('alter table `mh_journal_notes` add index `mh_journal_notes_user_id_index`(`user_id`);');

    this.addSql('create table `mh_reminders` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `status` enum(\'active\', \'deleted\', \'archived\') not null default \'active\', `medication_schedule_id` int unsigned not null, `journal_note_id` int unsigned not null, `reminder_time` datetime not null, `reminder_status` enum(\'pending\', \'taken\', \'missed\') not null, `type` enum(\'0\', \'1\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `mh_reminders` add index `mh_reminders_status_index`(`status`);');
    this.addSql('alter table `mh_reminders` add index `mh_reminders_medication_schedule_id_index`(`medication_schedule_id`);');
    this.addSql('alter table `mh_reminders` add unique `mh_reminders_journal_note_id_unique`(`journal_note_id`);');

    this.addSql('create table `mh_user_preferences` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `status` enum(\'active\', \'deleted\', \'archived\') not null default \'active\', `before_break_fast` time not null, `after_break_fast` time not null, `before_lunch` time not null, `after_lunch` time not null, `before_dinner` time not null, `after_dinner` time not null, `before_bed_time` time not null, `user_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `mh_user_preferences` add index `mh_user_preferences_status_index`(`status`);');
    this.addSql('alter table `mh_user_preferences` add unique `mh_user_preferences_user_id_unique`(`user_id`);');

    this.addSql('alter table `mh_medication_schedule` add constraint `mh_medication_schedule_user_id_foreign` foreign key (`user_id`) references `mh_users` (`id`) on update cascade;');

    this.addSql('alter table `mh_kick_counter` add constraint `mh_kick_counter_user_id_foreign` foreign key (`user_id`) references `mh_users` (`id`) on update cascade;');

    this.addSql('alter table `mh_journal_security` add constraint `mh_journal_security_user_id_foreign` foreign key (`user_id`) references `mh_users` (`id`) on update cascade;');

    this.addSql('alter table `mh_journal_notes` add constraint `mh_journal_notes_user_id_foreign` foreign key (`user_id`) references `mh_users` (`id`) on update cascade;');

    this.addSql('alter table `mh_reminders` add constraint `mh_reminders_medication_schedule_id_foreign` foreign key (`medication_schedule_id`) references `mh_medication_schedule` (`id`) on update cascade;');
    this.addSql('alter table `mh_reminders` add constraint `mh_reminders_journal_note_id_foreign` foreign key (`journal_note_id`) references `mh_journal_notes` (`id`) on update cascade;');

    this.addSql('alter table `mh_user_preferences` add constraint `mh_user_preferences_user_id_foreign` foreign key (`user_id`) references `mh_users` (`id`) on update cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `mh_medication_schedule` drop foreign key `mh_medication_schedule_user_id_foreign`;');

    this.addSql('alter table `mh_kick_counter` drop foreign key `mh_kick_counter_user_id_foreign`;');

    this.addSql('alter table `mh_journal_security` drop foreign key `mh_journal_security_user_id_foreign`;');

    this.addSql('alter table `mh_journal_notes` drop foreign key `mh_journal_notes_user_id_foreign`;');

    this.addSql('alter table `mh_user_preferences` drop foreign key `mh_user_preferences_user_id_foreign`;');

    this.addSql('alter table `mh_reminders` drop foreign key `mh_reminders_medication_schedule_id_foreign`;');

    this.addSql('alter table `mh_reminders` drop foreign key `mh_reminders_journal_note_id_foreign`;');

    this.addSql('drop table if exists `mh_users`;');

    this.addSql('drop table if exists `mh_medication_schedule`;');

    this.addSql('drop table if exists `mh_kick_counter`;');

    this.addSql('drop table if exists `mh_journal_security`;');

    this.addSql('drop table if exists `mh_journal_notes`;');

    this.addSql('drop table if exists `mh_reminders`;');

    this.addSql('drop table if exists `mh_user_preferences`;');
  }

}
