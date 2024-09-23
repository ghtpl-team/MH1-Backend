import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DayjsService {
  private readonly indianTimezone = 'Asia/Kolkata';

  getCurrentDate(): string {
    return dayjs().tz(this.indianTimezone).format('YYYY-MM-DD');
  }

  getCurrentDateTime(): string {
    return dayjs().tz(this.indianTimezone).format('YYYY-MM-DD HH:mm:ss');
  }

  getCurrentTime(): string {
    return dayjs().tz(this.indianTimezone).format('HH:mm:ss');
  }

  getCurrentDay(): string {
    return dayjs().tz(this.indianTimezone).format('dddd');
  }

  formatDate(date: Date | string, format: string): string {
    return dayjs(date).tz(this.indianTimezone).format(format);
  }

  addDays(date: Date | string, days: number): Date {
    return dayjs(date).tz(this.indianTimezone).add(days, 'day').toDate();
  }

  subtractDays(date: Date | string, days: number): Date {
    return dayjs(date).tz(this.indianTimezone).subtract(days, 'day').toDate();
  }

  isBefore(date1: Date | string, date2: Date | string): boolean {
    return dayjs(date1)
      .tz(this.indianTimezone)
      .isBefore(dayjs(date2).tz(this.indianTimezone));
  }

  isAfter(date1: Date | string, date2: Date | string): boolean {
    return dayjs(date1)
      .tz(this.indianTimezone)
      .isAfter(dayjs(date2).tz(this.indianTimezone));
  }

  convertToIST(date: Date | string): string {
    return dayjs(date).tz(this.indianTimezone).format('YYYY-MM-DD HH:mm:ss');
  }
}
