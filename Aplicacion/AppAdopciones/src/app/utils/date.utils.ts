export class DateUtils {
  
  static formatDate(value: string | Date, includeTime: boolean = false): string {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('es-EC', options);
  }
  
  static formatDateShort(value: string | Date): string {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  static formatTime(value: string | Date): string {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  static getRelativeTime(value: string | Date): string {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffMinutes < 1) {
      return 'Hace un momento';
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else if (diffWeeks < 4) {
      return `Hace ${diffWeeks} semana${diffWeeks !== 1 ? 's' : ''}`;
    } else if (diffMonths < 12) {
      return `Hace ${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
    } else {
      return `Hace ${diffYears} año${diffYears !== 1 ? 's' : ''}`;
    }
  }
  
  static getDayName(value: string | Date): string {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('es-EC', { weekday: 'long' });
  }
  
  static getMonthName(value: string | Date): string {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('es-EC', { month: 'long' });
  }
  
  static isToday(value: string | Date): boolean {
    if (!value) return false;
    
    const date = new Date(value);
    const today = new Date();
    
    return date.toDateString() === today.toDateString();
  }
  
  static isTomorrow(value: string | Date): boolean {
    if (!value) return false;
    
    const date = new Date(value);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return date.toDateString() === tomorrow.toDateString();
  }
  
  static isYesterday(value: string | Date): boolean {
    if (!value) return false;
    
    const date = new Date(value);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return date.toDateString() === yesterday.toDateString();
  }
  
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  
  static getStartOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }
  
  static getEndOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }
  
  static isBetween(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }
  
  static formatDateRange(start: string | Date, end: string | Date): string {
    if (!start || !end) return '';
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '';
    
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    
    if (isSameDay) {
      return `${this.formatDate(startDate)} de ${this.formatTime(startDate)} a ${this.formatTime(endDate)}`;
    } else {
      return `${this.formatDate(startDate)} a ${this.formatDate(endDate)}`;
    }
  }
}