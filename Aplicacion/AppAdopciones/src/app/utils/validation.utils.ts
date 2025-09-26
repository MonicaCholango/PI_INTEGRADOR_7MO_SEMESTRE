import { VALIDATION_CONSTANTS } from '../models/constants';

export class ValidationUtils {
  
  static validateCedula(cedula: string): boolean {
    if (!cedula || cedula.length !== VALIDATION_CONSTANTS.CEDULA_LENGTH) {
      return false;
    }

    if (!this.isNumeric(cedula)) {
      return false;
    }

    const digitos = cedula.split('').map(d => parseInt(d));
    const provincia = parseInt(cedula.substring(0, 2));

    if (provincia < 1 || provincia > 24) {
      return false;
    }

    const verificador = digitos[9];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let digito = digitos[i];
      if (i % 2 === 0) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }
      suma += digito;
    }

    const modulo = suma % 10;
    const digitoVerificador = modulo === 0 ? 0 : 10 - modulo;

    return verificador === digitoVerificador;
  }

  static validateEmail(email: string): boolean {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!password) {
      errors.push('La contraseña es requerida');
      return { isValid: false, errors };
    }

    if (password.length < VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH) {
      errors.push(`La contraseña debe tener al menos ${VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`);
    }

    if (password.length > VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH) {
      errors.push(`La contraseña no puede tener más de ${VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH} caracteres`);
    }

    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePhone(phone: string): boolean {
    if (!phone) return false;
    
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (cleanPhone.length < VALIDATION_CONSTANTS.PHONE_MIN_LENGTH ||
        cleanPhone.length > VALIDATION_CONSTANTS.PHONE_MAX_LENGTH) {
      return false;
    }

    return this.isNumeric(cleanPhone);
  }

  static validateName(name: string): boolean {
    if (!name) return false;
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < VALIDATION_CONSTANTS.NAME_MIN_LENGTH ||
        trimmedName.length > VALIDATION_CONSTANTS.NAME_MAX_LENGTH) {
      return false;
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(trimmedName);
  }

  static isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
  }

  static validateMinAge(birthDate: string, minAge: number = 18): boolean {
    if (!birthDate) return false;
    
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= minAge;
    }
    
    return age >= minAge;
  }

  static validateFileSize(file: File): boolean {
    return file.size <= VALIDATION_CONSTANTS.FILE_MAX_SIZE;
  }

  static validateImageType(file: File): boolean {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    const validMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif'
    ];
    
    if (validMimeTypes.includes(fileType)) {
      return true;
    }
    
    const extension = fileName.split('.').pop();
    return extension ? VALIDATION_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(extension) : false;
  }

  static validateRegistrationForm(formData: any): {
    isValid: boolean;
    errors: { [key: string]: string[] };
  } {
    const errors: { [key: string]: string[] } = {};

    if (!formData.nombres || !this.validateName(formData.nombres)) {
      errors['nombres'] = ['Los nombres deben tener entre 2 y 100 caracteres y solo contener letras'];
    }

    if (!formData.apellidos || !this.validateName(formData.apellidos)) {
      errors['apellidos'] = ['Los apellidos deben tener entre 2 y 100 caracteres y solo contener letras'];
    }

    if (!formData.cedula || !this.validateCedula(formData.cedula)) {
      errors['cedula'] = ['La cédula ingresada no es válida'];
    }

    if (!formData.correo || !this.validateEmail(formData.correo)) {
      errors['correo'] = ['El formato del email no es válido'];
    }

    if (!formData.telefono || !this.validatePhone(formData.telefono)) {
      errors['telefono'] = ['El número de teléfono no es válido'];
    }

    if (!formData.celular || !this.validatePhone(formData.celular)) {
      errors['celular'] = ['El número de celular no es válido'];
    }

    if (!formData.fechaNacimiento || !this.validateMinAge(formData.fechaNacimiento)) {
      errors['fechaNacimiento'] = ['Debe ser mayor de 18 años para registrarse'];
    }

    if (!formData.ciudad_id) {
      errors['ciudad_id'] = ['Debe seleccionar una ciudad'];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static sanitizeString(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static validateTextLength(text: string, maxLength: number): boolean {
    return text ? text.length <= maxLength : true;
  }

  static getErrorMessage(field: string, errors: string[]): string {
    if (!errors || errors.length === 0) return '';
    
    const fieldNames: { [key: string]: string } = {
      nombres: 'Nombres',
      apellidos: 'Apellidos', 
      cedula: 'Cédula',
      correo: 'Email',
      telefono: 'Teléfono',
      celular: 'Celular',
      fechaNacimiento: 'Fecha de nacimiento',
      ciudad_id: 'Ciudad',
      password: 'Contraseña'
    };

    const fieldName = fieldNames[field] || field;
    return `${fieldName}: ${errors[0]}`;
  }

  static validateFormField(value: any, fieldName: string, validations: string[]): string[] {
    const errors: string[] = [];

    for (const validation of validations) {
      switch (validation) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            errors.push(`${fieldName} es requerido`);
          }
          break;
        case 'email':
          if (value && !this.validateEmail(value)) {
            errors.push(`${fieldName} debe tener un formato válido`);
          }
          break;
        case 'cedula':
          if (value && !this.validateCedula(value)) {
            errors.push(`${fieldName} no es una cédula válida`);
          }
          break;
        case 'phone':
          if (value && !this.validatePhone(value)) {
            errors.push(`${fieldName} no es un número válido`);
          }
          break;
        case 'name':
          if (value && !this.validateName(value)) {
            errors.push(`${fieldName} debe contener solo letras`);
          }
          break;
      }
    }

    return errors;
  }
}