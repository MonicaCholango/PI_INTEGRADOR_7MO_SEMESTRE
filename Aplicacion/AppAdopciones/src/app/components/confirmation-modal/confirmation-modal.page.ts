
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

export interface ConfirmationModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  icon?: string;
  iconColor?: string;
  type?: 'default' | 'warning' | 'danger' | 'success' | 'info';
  showInput?: boolean;
  inputPlaceholder?: string;
  inputType?: string;
  inputValue?: string;
  required?: boolean;
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() data: ConfirmationModalData = {
    title: 'Confirmar',
    message: '¿Estás seguro?'
  };

  @Output() onConfirm = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onDismiss = new EventEmitter<void>();

  inputValue = '';

  constructor() {}

  ngOnInit() {
    this.setupDefaults();
    this.inputValue = this.data.inputValue || '';
  }

  ngOnChanges() {
    this.setupDefaults();
    this.inputValue = this.data.inputValue || '';
  }

  private setupDefaults() {
    switch (this.data.type) {
      case 'warning':
        this.data.icon = this.data.icon || 'warning';
        this.data.iconColor = this.data.iconColor || 'warning';
        this.data.confirmColor = this.data.confirmColor || 'warning';
        break;
      case 'danger':
        this.data.icon = this.data.icon || 'trash';
        this.data.iconColor = this.data.iconColor || 'danger';
        this.data.confirmColor = this.data.confirmColor || 'danger';
        break;
      case 'success':
        this.data.icon = this.data.icon || 'checkmark-circle';
        this.data.iconColor = this.data.iconColor || 'success';
        this.data.confirmColor = this.data.confirmColor || 'success';
        break;
      case 'info':
        this.data.icon = this.data.icon || 'information-circle';
        this.data.iconColor = this.data.iconColor || 'primary';
        this.data.confirmColor = this.data.confirmColor || 'primary';
        break;
      default:
        this.data.icon = this.data.icon || 'help-circle';
        this.data.iconColor = this.data.iconColor || 'primary';
        this.data.confirmColor = this.data.confirmColor || 'primary';
    }

    
    this.data.confirmText = this.data.confirmText || 'Confirmar';
    this.data.cancelText = this.data.cancelText || 'Cancelar';
    this.data.inputType = this.data.inputType || 'text';
    this.data.inputPlaceholder = this.data.inputPlaceholder || 'Ingresa el valor';
  }

  handleConfirm() {
    if (this.data.showInput) {
      if (this.data.required && !this.inputValue.trim()) {
        return; 
      }
      this.onConfirm.emit(this.inputValue);
    } else {
      this.onConfirm.emit(true);
    }
    this.close();
  }

  handleCancel() {
    this.onCancel.emit();
    this.close();
  }

  handleDismiss() {
    this.onDismiss.emit();
    this.close();
  }

  private close() {
    this.isOpen = false;
    this.inputValue = '';
  }

  get canConfirm(): boolean {
    if (this.data.showInput && this.data.required) {
      return this.inputValue.trim().length > 0;
    }
    return true;
  }

  get modalClasses(): string {
    const classes = ['confirmation-modal'];
    if (this.data.type) {
      classes.push(`modal-${this.data.type}`);
    }
    return classes.join(' ');
  }

  getConfirmIcon(): string {
    switch (this.data.type) {
      case 'danger':
        return 'trash';
      case 'warning':
        return 'warning';
      case 'success':
        return 'checkmark';
      case 'info':
        return 'information';
      default:
        return 'checkmark';
    }
  }
}