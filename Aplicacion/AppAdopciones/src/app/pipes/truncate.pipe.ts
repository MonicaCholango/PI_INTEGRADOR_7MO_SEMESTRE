import { Pipe, PipeTransform } from '@angular/core';
import { FormatUtils } from '../utils/format.utils';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 100, suffix: string = '...', wordBoundary: boolean = true): string {
    if (!value) return '';
    
    if (value.length <= limit) return value;

    if (wordBoundary) {
      const truncated = value.substring(0, limit);
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      
      if (lastSpaceIndex > 0 && lastSpaceIndex > limit * 0.7) {
        return truncated.substring(0, lastSpaceIndex) + suffix;
      }
    }

    return FormatUtils.truncateText(value, limit, suffix);
  }
}