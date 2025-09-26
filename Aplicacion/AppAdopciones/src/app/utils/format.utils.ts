export class FormatUtils {


  static formatName(name: string): string {
    if (!name) return '';
    
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  static formatCedula(cedula: string): string {
    if (!cedula || cedula.length !== 10) return cedula;
    
    return `${cedula.substring(0, 2)}-${cedula.substring(2, 9)}-${cedula.substring(9)}`;
  }


  static formatPhone(phone: string): string {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 7) {
      return `${cleaned.substring(0, 3)}-${cleaned.substring(3)}`;
    } else if (cleaned.length === 9 && cleaned.startsWith('0')) {
      return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 5)}-${cleaned.substring(5)}`;
    } else if (cleaned.length === 10 && cleaned.startsWith('09')) {
      return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    
    return phone; 
  }

  static truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  static capitalizeWords(text: string): string {
    if (!text) return '';
    
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  static toTitleCase(text: string): string {
    if (!text) return '';
    
    return text.replace(/\w+/g, (word) => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }

  static toSlug(text: string): string {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  }


  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  static formatPercentage(value: number, decimals: number = 1): string {
    return (value * 100).toFixed(decimals) + '%';
  }

  static toUpperCaseWithAccents(text: string): string {
    if (!text) return '';
    
    const accents: { [key: string]: string } = {
      'á': 'Á', 'é': 'É', 'í': 'Í', 'ó': 'Ó', 'ú': 'Ú',
      'ñ': 'Ñ', 'ü': 'Ü'
    };
    
    return text.toUpperCase().replace(/[áéíóúñü]/g, (match) => accents[match] || match);
  }

  static cleanWhitespace(text: string): string {
    if (!text) return '';
    
    return text
      .trim()
      .replace(/\s+/g, ' '); 
  }


  static getInitials(name: string, maxInitials: number = 2): string {
    if (!name) return '';
    
    const words = name.trim().split(/\s+/);
    const initials = words
      .slice(0, maxInitials)
      .map(word => word.charAt(0).toUpperCase());
    
    return initials.join('');
  }


  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;
    
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  }


  static maskPhone(phone: string): string {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) return phone;
    
    const masked = '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
    return this.formatPhone(masked);
  }


  static objectToQueryString(obj: any): string {
    const params = new URLSearchParams();
    
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        params.append(key, obj[key].toString());
      }
    });
    
    return params.toString();
  }

  static normalizeForSearch(text: string): string {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^\w\s]/g, '') 
      .trim();
  }


  static formatAddress(address: any): string {
    const parts = [];
    
    if (address.street) parts.push(address.street);
    if (address.number) parts.push(`#${address.number}`);
    if (address.neighborhood) parts.push(address.neighborhood);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    
    return parts.join(', ');
  }


  static formatPostalCode(code: string): string {
    if (!code) return '';
    
    const cleaned = code.replace(/\D/g, '');
    
    if (cleaned.length === 6) {
      return cleaned;
    }
    
    return code; 
  }
}