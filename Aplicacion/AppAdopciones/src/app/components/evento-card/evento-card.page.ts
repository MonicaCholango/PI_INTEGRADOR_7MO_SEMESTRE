import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Evento } from '../../models/interfaces';
import { API_CONSTANTS, APP_CONSTANTS } from '../../models/constants';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-evento-card',
  templateUrl: './evento-card.page.html',
  styleUrls: ['./evento-card.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    DateFormatPipe,
    TruncatePipe
  ]
})
export class EventoCardComponent {
  @Input() evento!: Evento;
  @Input() showRegisterButton = false;
  @Input() showDetailsButton = true;
  @Input() showEditButton = false;
  @Input() showDeleteButton = false;
  @Input() showExternalButton = true;
  @Input() compact = false;
  @Input() disabled = false;

  @Output() onRegister = new EventEmitter<Evento>();
  @Output() onViewDetails = new EventEmitter<Evento>();
  @Output() onEdit = new EventEmitter<Evento>();
  @Output() onDelete = new EventEmitter<Evento>();
  @Output() onOpenExternal = new EventEmitter<Evento>();
  @Output() onImageError = new EventEmitter<Event>();

  readonly defaultImage = APP_CONSTANTS.DEFAULT_EVENTO_IMAGE;

  constructor() {}

  handleRegister(): void {
    if (!this.disabled && this.canRegister) {
      this.onRegister.emit(this.evento);
    }
  }

  handleViewDetails(): void {
    if (this.disabled) return;
    this.onViewDetails.emit(this.evento);
  }

  handleEdit(): void {
    if (!this.disabled) {
      this.onEdit.emit(this.evento);
    }
  }

  handleDelete(): void {
    if (!this.disabled) {
      this.onDelete.emit(this.evento);
    }
  }

  handleOpenExternal(): void {
    if (!this.disabled && this.evento.url_externa) {
      window.open(this.evento.url_externa, '_blank');
      this.onOpenExternal.emit(this.evento);
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
    this.onImageError.emit(event);
  }

  get canRegister(): boolean {
    if (!this.evento) return false;
    if (!this.evento.requiere_registro) return false;
    if (this.evento.estado_vigencia !== 'vigente') return false;
    if (this.evento.cupo_maximo && this.evento.cupo_actual && 
        this.evento.cupo_actual >= this.evento.cupo_maximo) return false;
    return true;
  }

  get tipoIcon(): string {
    if (!this.evento?.tipo_evento) return 'information-circle-outline';
    
    switch (this.evento.tipo_evento) {
      case 'Campaña':
        return 'megaphone-outline';
      case 'Evento':
        return 'calendar-outline';
      case 'Noticia':
        return 'newspaper-outline';
      case 'Adopción':
        return 'heart-outline';
      default:
        return 'information-circle-outline';
    }
  }

  get estadoIcon(): string {
    if (!this.evento?.estado_vigencia) return 'help-circle-outline';
    
    switch (this.evento.estado_vigencia) {
      case 'vigente':
        return 'checkmark-circle-outline';
      case 'programado':
        return 'time-outline';
      case 'vencido':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  }

  getEstadoTexto(): string {
    if (!this.evento?.estado_vigencia) return 'Sin estado';
    
    switch (this.evento.estado_vigencia) {
      case 'vigente':
        return 'Vigente';
      case 'programado':
        return 'Programado';
      case 'vencido':
        return 'Finalizado';
      default:
        return 'Sin estado';
    }
  }

  getEstadoColor(): string {
    if (!this.evento?.estado_vigencia) return 'medium';
    
    switch (this.evento.estado_vigencia) {
      case 'vigente':
        return 'success';
      case 'programado':
        return 'warning';
      case 'vencido':
        return 'medium';
      default:
        return 'medium';
    }
  }

  getCupoColor(): string {
    if (!this.evento?.cupo_maximo) return 'primary';
    
    const porcentaje = ((this.evento.cupo_actual || 0) / this.evento.cupo_maximo) * 100;
    
    if (porcentaje >= 100) return 'danger';
    if (porcentaje >= 75) return 'warning';
    return 'success';
  }

  // FUNCIÓN CORREGIDA para construir URL de imagen
  getImageUrl(foto: string | null | undefined): string {
    if (!foto || foto.trim() === '') {
      return this.defaultImage;
    }
    
    // Verificar si ya es una URL completa
    if (foto.startsWith('http') || foto.startsWith('/')) {
      return foto;
    }
    
    // Construir URL completa para fotos de eventos
    return `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.UPLOAD_PATHS.EVENTOS}${foto}`;
  }

  // FUNCIÓN CORREGIDA para formatear fechas usando tu DateFormatPipe
  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return '';
    
    try {
      const fechaObj = new Date(fecha);
      
      // Verificar que la fecha sea válida
      if (isNaN(fechaObj.getTime())) {
        return '';
      }
      
      const ahora = new Date();
      const esHoy = fechaObj.toDateString() === ahora.toDateString();
      const esMañana = fechaObj.toDateString() === new Date(ahora.getTime() + 24 * 60 * 60 * 1000).toDateString();
      
      if (esHoy) {
        return `Hoy ${fechaObj.toLocaleTimeString('es-EC', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      }
      
      if (esMañana) {
        return `Mañana ${fechaObj.toLocaleTimeString('es-EC', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      }
      
      // Para fechas normales, usar el formato corto
      return fechaObj.toLocaleDateString('es-EC', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
      
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }
}