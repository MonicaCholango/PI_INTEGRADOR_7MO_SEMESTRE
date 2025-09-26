import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/date.utils';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date, format: 'full' | 'short' | 'time' | 'relative' | 'day' | 'month' = 'full'): string {
    if (!value) return '';

    switch (format) {
      case 'full':
        return DateUtils.formatDate(value, true);
      case 'short':
        return DateUtils.formatDateShort(value);
      case 'time':
        return DateUtils.formatTime(value);
      case 'relative':
        return DateUtils.getRelativeTime(value);
      case 'day':
        return DateUtils.getDayName(value);
      case 'month':
        return DateUtils.getMonthName(value);
      default:
        return DateUtils.formatDate(value);
    }
  }
}