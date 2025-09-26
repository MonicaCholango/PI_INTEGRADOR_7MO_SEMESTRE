import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Solicitud } from '../../models/interfaces';
import { EstadoSolicitud } from '../../models/enums';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { EstadoColorPipe } from '../../pipes/estado-color.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { APP_CONSTANTS } from '../../models/constants';

@Component({
  selector: 'app-solicitud-card',
  templateUrl: './solicitud-card.component.html',
  styleUrls: ['./solicitud-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    DateFormatPipe,
    EstadoColorPipe,
    TruncatePipe
  ]
})
export class SolicitudCardComponent {
  @Input() solicitud!: Solicitud;
  @Input() showUserInfo = true;
  @Input() showMascotaInfo = true;
  @Input() showActions = false;
  @Input() showTimeline = false;
  @Input() compact = false;
  @Input() disabled = false;
  @Input() isAdmin = false;

  @Output() onViewDetails = new EventEmitter<Solicitud>();
  @Output() onApprove = new EventEmitter<Solicitud>();
  @Output() onReject = new EventEmitter<Solicitud>();
  @Output() onReview = new EventEmitter<Solicitud>();
  @Output() onCancel = new EventEmitter<Solicitud>();
  @Output() onContact = new EventEmitter<Solicitud>();
  @Output() onImageError = new EventEmitter<Event>();

  readonly defaultImage = APP_CONSTANTS.DEFAULT_MASCOTA_IMAGE;
  readonly EstadoSolicitud = EstadoSolicitud;

  constructor() {}

  handleViewDetails(): void {
    if (!this.disabled) {
      this.onViewDetails.emit(this.solicitud);
    }
  }

  handleApprove(): void {
    if (!this.disabled && this.canApprove) {
      this.onApprove.emit(this.solicitud);
    }
  }

  handleReject(): void {
    if (!this.disabled && this.canReject) {
      this.onReject.emit(this.solicitud);
    }
  }

  handleReview(): void {
    if (!this.disabled && this.canReview) {
      this.onReview.emit(this.solicitud);
    }
  }

  handleCancel(): void {
    if (!this.disabled && this.canCancel) {
      this.onCancel.emit(this.solicitud);
    }
  }

  handleContact(): void {
    if (!this.disabled) {
      this.onContact.emit(this.solicitud);
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
    this.onImageError.emit(event);
  }

  get estadoIcon(): string {
    switch (this.solicitud.estado) {
      case EstadoSolicitud.APROBADO:
        return 'checkmark-circle';
      case EstadoSolicitud.PENDIENTE:
        return 'time';
      case EstadoSolicitud.EN_REVISION:
        return 'eye';
      case EstadoSolicitud.RECHAZADO:
        return 'close-circle';
      case EstadoSolicitud.CANCELADO:
        return 'ban';
      default:
        return 'help-circle';
    }
  }

  get estadoColor(): string {
    switch (this.solicitud.estado) {
      case EstadoSolicitud.APROBADO:
        return 'success';
      case EstadoSolicitud.PENDIENTE:
        return 'warning';
      case EstadoSolicitud.EN_REVISION:
        return 'primary';
      case EstadoSolicitud.RECHAZADO:
        return 'danger';
      case EstadoSolicitud.CANCELADO:
        return 'medium';
      default:
        return 'medium';
    }
  }

  get estadoDescripcion(): string {
    switch (this.solicitud.estado) {
      case EstadoSolicitud.APROBADO:
        return '¡Felicidades! Tu solicitud ha sido aprobada.';
      case EstadoSolicitud.PENDIENTE:
        return 'Tu solicitud está siendo revisada.';
      case EstadoSolicitud.EN_REVISION:
        return 'Estamos evaluando tu solicitud con más detalle.';
      case EstadoSolicitud.RECHAZADO:
        return 'Tu solicitud no pudo ser aprobada en esta ocasión.';
      case EstadoSolicitud.CANCELADO:
        return 'La solicitud ha sido cancelada.';
      default:
        return 'Estado de la solicitud';
    }
  }

  get canApprove(): boolean {
    return this.isAdmin && 
           (this.solicitud.estado === EstadoSolicitud.PENDIENTE || 
            this.solicitud.estado === EstadoSolicitud.EN_REVISION);
  }

  get canReject(): boolean {
    return this.isAdmin && 
           (this.solicitud.estado === EstadoSolicitud.PENDIENTE || 
            this.solicitud.estado === EstadoSolicitud.EN_REVISION);
  }

  get canReview(): boolean {
    return this.isAdmin && this.solicitud.estado === EstadoSolicitud.PENDIENTE;
  }

  get canCancel(): boolean {
    return !this.isAdmin && 
           (this.solicitud.estado === EstadoSolicitud.PENDIENTE || 
            this.solicitud.estado === EstadoSolicitud.EN_REVISION);
  }

  get showProgressSteps(): boolean {
    return this.showTimeline && !this.compact;
  }

  get progressSteps(): Array<{label: string; icon: string; active: boolean; completed: boolean}> {
    const steps = [
      {
        label: 'Enviada',
        icon: 'document-text',
        active: true,
        completed: true
      },
      {
        label: 'En Revisión',
        icon: 'eye',
        active: this.solicitud.estado === EstadoSolicitud.EN_REVISION,
        completed: [EstadoSolicitud.EN_REVISION, EstadoSolicitud.APROBADO, EstadoSolicitud.RECHAZADO].includes(this.solicitud.estado)
      },
      {
        label: this.solicitud.estado === EstadoSolicitud.RECHAZADO ? 'Rechazada' : 'Aprobada',
        icon: this.solicitud.estado === EstadoSolicitud.RECHAZADO ? 'close' : 'checkmark',
        active: [EstadoSolicitud.APROBADO, EstadoSolicitud.RECHAZADO].includes(this.solicitud.estado),
        completed: [EstadoSolicitud.APROBADO, EstadoSolicitud.RECHAZADO].includes(this.solicitud.estado)
      }
    ];

    return steps;
  }

  get timeAgo(): string {
    if (!this.solicitud.fecha_solicitud) return '';
    
    const now = new Date();
    const solicitudDate = new Date(this.solicitud.fecha_solicitud);
    const diffMs = now.getTime() - solicitudDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return solicitudDate.toLocaleDateString('es-EC');
  }

  get priorityLevel(): 'high' | 'medium' | 'low' {
    if (!this.solicitud.fecha_solicitud) return 'low';
    
    const now = new Date();
    const solicitudDate = new Date(this.solicitud.fecha_solicitud);
    const diffMs = now.getTime() - solicitudDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (this.solicitud.estado === EstadoSolicitud.PENDIENTE) {
      if (diffHours > 48) return 'high';
      if (diffHours > 24) return 'medium';
    }
    
    return 'low';
  }

  get cardClasses(): string {
    const classes = ['solicitud-card'];
    
    if (this.compact) classes.push('solicitud-card-compact');
    if (this.disabled) classes.push('solicitud-card-disabled');
    if (this.priorityLevel === 'high') classes.push('high-priority');
    if (this.priorityLevel === 'medium') classes.push('medium-priority');
    
    return classes.join(' ');
  }
}