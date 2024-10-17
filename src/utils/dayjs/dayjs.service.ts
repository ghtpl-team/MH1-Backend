import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { TimezoneService } from 'src/common/timezone/timezone.service';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

@Injectable()
export class DayjsService {
  constructor(private readonly timezoneService: TimezoneService) {}

  private getCurrentTimezone(): string {
    return this.timezoneService.getTimezone();
  }

  getCurrentDate(): string {
    return dayjs().tz(this.getCurrentTimezone()).format('YYYY-MM-DD');
  }

  getCurrentDateTime(): string {
    return dayjs().tz(this.getCurrentTimezone()).format('YYYY-MM-DD HH:mm:ss');
  }

  getCurrentTime(): string {
    return dayjs().tz(this.getCurrentTimezone()).format('HH:mm:ss');
  }

  getCurrentDay(): string {
    return dayjs().tz(this.getCurrentTimezone()).format('dddd');
  }

  formatDate(date: Date | string, format: string): string {
    return dayjs(date).tz(this.getCurrentTimezone()).format(format);
  }

  addDays(date: Date | string, days: number): string {
    return dayjs(date)
      .tz(this.getCurrentTimezone())
      .add(days, 'day')
      .format('YYYY-MM-DD');
  }

  subtractDays(date: Date | string, days: number): string {
    return dayjs(date)
      .tz(this.getCurrentTimezone())
      .subtract(days, 'day')
      .format('YYYY-MM-DD');
  }

  isBefore(date1: Date | string, date2: Date | string): boolean {
    return dayjs(date1)
      .tz(this.getCurrentTimezone())
      .isBefore(dayjs(date2).tz(this.getCurrentTimezone()));
  }

  isAfter(date1: Date | string, date2: Date | string): boolean {
    return dayjs(date1)
      .tz(this.getCurrentTimezone())
      .isAfter(dayjs(date2).tz(this.getCurrentTimezone()));
  }

  convertToIST(date: Date | string): string {
    return dayjs(date)
      .tz(this.getCurrentTimezone())
      .format('YYYY-MM-DD HH:mm:ss');
  }

  getDiff(
    date1: Date | string,
    date2: Date | string,
    diffUnit: dayjs.QUnitType | dayjs.OpUnitType = 'day',
  ): number {
    return dayjs(date1)
      .tz(this.getCurrentTimezone())
      .diff(dayjs(date2).tz(this.getCurrentTimezone()), diffUnit);
  }

  formatTimeTo12hour(time: string): string {
    return dayjs(time, 'HH:mm:ss').format('hh:mm A');
  }

  convertToLocalTime(date: Date | string): string {
    return dayjs(date).tz(this.getCurrentTimezone()).format('hh:mm A');
  }
}
