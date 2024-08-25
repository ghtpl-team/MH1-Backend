import { Migration } from '@mikro-orm/migrations';

export class Migration20240822092604 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "mh_kick_counter" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "status" text check ("status" in (\'active\', \'deleted\', \'archived\')) not null default \'active\', "date" date not null, "start_time" time(0) not null, "duration_in_sec" int not null, "kick_count" int not null, "user_id" int not null);');
    this.addSql('create index "mh_kick_counter_status_index" on "mh_kick_counter" ("status");');
    this.addSql('create index "mh_kick_counter_date_index" on "mh_kick_counter" ("date");');

    this.addSql('alter table "mh_kick_counter" add constraint "mh_kick_counter_user_id_foreign" foreign key ("user_id") references "mh_users" ("id") on update cascade;');

    this.addSql('alter table "mh_users" drop constraint "user_phone_unique";');
    this.addSql('alter table "mh_users" add constraint "mh_users_phone_unique" unique ("phone");');

    this.addSql('alter table "mh_medication_schedule" alter column "intake_time" type jsonb using ("intake_time"::jsonb);');
    this.addSql('alter table "mh_medication_schedule" drop constraint "medication_schedule_user_id_medication_name_unique";');
    this.addSql('alter table "mh_medication_schedule" add constraint "mh_medication_schedule_user_id_medication_name_unique" unique ("user_id", "medication_name");');

    this.addSql('alter table "mh_reminders" drop constraint "reminder_journal_note_id_unique";');
    this.addSql('alter table "mh_reminders" add constraint "mh_reminders_journal_note_id_unique" unique ("journal_note_id");');

    this.addSql('alter table "mh_user_preferences" drop constraint "user_preferences_user_id_unique";');
    this.addSql('alter table "mh_user_preferences" add constraint "mh_user_preferences_user_id_unique" unique ("user_id");');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "mh_kick_counter" cascade;');

    this.addSql('alter table "mh_medication_schedule" alter column "intake_time" type jsonb using ("intake_time"::jsonb);');
    this.addSql('alter table "mh_medication_schedule" drop constraint "mh_medication_schedule_user_id_medication_name_unique";');
    this.addSql('alter table "mh_medication_schedule" add constraint "medication_schedule_user_id_medication_name_unique" unique ("user_id", "medication_name");');

    this.addSql('alter table "mh_reminders" drop constraint "mh_reminders_journal_note_id_unique";');
    this.addSql('alter table "mh_reminders" add constraint "reminder_journal_note_id_unique" unique ("journal_note_id");');

    this.addSql('alter table "mh_user_preferences" drop constraint "mh_user_preferences_user_id_unique";');
    this.addSql('alter table "mh_user_preferences" add constraint "user_preferences_user_id_unique" unique ("user_id");');

    this.addSql('alter table "mh_users" drop constraint "mh_users_phone_unique";');
    this.addSql('alter table "mh_users" add constraint "user_phone_unique" unique ("phone");');
  }

}
