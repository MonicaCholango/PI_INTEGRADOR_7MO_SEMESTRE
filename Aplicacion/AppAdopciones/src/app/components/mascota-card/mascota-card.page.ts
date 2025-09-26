import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Mascota } from '../../models/interfaces';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { EstadoColorPipe } from '../../pipes/estado-color.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { APP_CONSTANTS } from '../../models/constants';

@Component({
  selector: 'app-mascota-card',
  templateUrl: './mascota-card.component.html',
  styleUrls: ['./mascota-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    DateFormatPipe,
    EstadoColorPipe,
    TruncatePipe
  ]
})
export class MascotaCardComponent {
  @Input() mascota!: Mascota;
  @Input() showAdoptButton = true;
  @Input() showDetailsButton = true;
  @Input() showEditButton = false;
  @Input() showDeleteButton = false;
  @Input() compact = false;
  @Input() disabled = false;

  @Output() onAdopt = new EventEmitter<Mascota>();
  @Output() onViewDetails = new EventEmitter<Mascota>();
  @Output() onEdit = new EventEmitter<Mascota>();
  @Output() onDelete = new EventEmitter<Mascota>();
  @Output() onImageError = new EventEmitter<Event>();

  readonly defaultImage = APP_CONSTANTS.DEFAULT_MASCOTA_IMAGE;

  constructor() {}

  handleAdopt(): void {
    if (!this.disabled && this.mascota.estado === 'Disponible') {
      this.onAdopt.emit(this.mascota);
    }
  }

  handleViewDetails(): void {
    if (!this.disabled) {
      this.onViewDetails.emit(this.mascota);
    }
  }

  handleEdit(): void {
    if (!this.disabled) {
      this.onEdit.emit(this.mascota);
    }
  }

  handleDelete(): void {
    if (!this.disabled) {
      this.onDelete.emit(this.mascota);
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
    this.onImageError.emit(event);
  }

  get isAvailable(): boolean {
    return this.mascota.estado === 'Disponible';
  }

  get statusIcon(): string {
    switch (this.mascota.estado?.toLowerCase()) {
      case 'disponible':
        return 'checkmark-circle';
      case 'adoptado':
        return 'heart';
      case 'en veterinaria':
        return 'medical';
      case 'enfermo':
        return 'sad';
      default:
        return 'help-circle';
    }
  }

  get genderIcon(): string {
    if (!this.mascota.genero) return 'help';
    return this.mascota.genero.toLowerCase() === 'macho' ? 'male' : 'female';
  }

  get personalityChips(): string[] {
    if (!this.mascota.personalidad) return [];
    return Array.isArray(this.mascota.personalidad) 
      ? this.mascota.personalidad.slice(0, 3) 
      : this.mascota.personalidad.split(',').slice(0, 3);
  }
}