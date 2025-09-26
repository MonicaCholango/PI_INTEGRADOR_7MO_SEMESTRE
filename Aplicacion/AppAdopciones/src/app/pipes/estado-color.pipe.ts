import { Pipe, PipeTransform } from '@angular/core';
import { EstadoSolicitud, EstadoMascota, TipoUsuario, ColorChip } from '../models/enums';

@Pipe({
  name: 'estadoColor',
  standalone: true
})
export class EstadoColorPipe implements PipeTransform {

  transform(value: string, type: 'solicitud' | 'mascota' | 'usuario' | 'general' = 'general'): string {
    if (!value) return ColorChip.MEDIUM;

    const estado = value.toLowerCase().trim();

    switch (type) {
      case 'solicitud':
        return this.getSolicitudColor(estado);
      case 'mascota':
        return this.getMascotaColor(estado);
      case 'usuario':
        return this.getUsuarioColor(estado);
      default:
        return this.getGeneralColor(estado);
    }
  }

  private getSolicitudColor(estado: string): string {
    switch (estado) {
      case EstadoSolicitud.APROBADO.toLowerCase():
        return ColorChip.SUCCESS;
      case EstadoSolicitud.PENDIENTE.toLowerCase():
        return ColorChip.WARNING;
      case EstadoSolicitud.EN_REVISION.toLowerCase():
        return ColorChip.PRIMARY;
      case EstadoSolicitud.RECHAZADO.toLowerCase():
        return ColorChip.DANGER;
      case EstadoSolicitud.CANCELADO.toLowerCase():
        return ColorChip.MEDIUM;
      default:
        return ColorChip.MEDIUM;
    }
  }

  private getMascotaColor(estado: string): string {
    switch (estado) {
      case EstadoMascota.DISPONIBLE.toLowerCase():
        return ColorChip.SUCCESS;
      case EstadoMascota.ADOPTADO.toLowerCase():
        return ColorChip.PRIMARY;
      case EstadoMascota.EN_VETERINARIA.toLowerCase():
        return ColorChip.WARNING;
      case EstadoMascota.ENFERMO.toLowerCase():
        return ColorChip.DANGER;
      case EstadoMascota.FALLECIDO.toLowerCase():
      case EstadoMascota.EUTANASIA.toLowerCase():
        return ColorChip.DARK;
      default:
        return ColorChip.MEDIUM;
    }
  }

  private getUsuarioColor(estado: string): string {
    switch (estado) {
      case 'activo':
        return ColorChip.SUCCESS;
      case 'inactivo':
        return ColorChip.MEDIUM;
      case 'bloqueado':
        return ColorChip.DANGER;
      case TipoUsuario.ADMIN.toLowerCase():
        return ColorChip.TERTIARY;
      case TipoUsuario.ADOPTANTE.toLowerCase():
        return ColorChip.PRIMARY;
      default:
        return ColorChip.MEDIUM;
    }
  }

  private getGeneralColor(estado: string): string {
    const positiveStates = ['activo', 'disponible', 'aprobado', 'exitoso', 'completado', 'confirmado'];
    const warningStates = ['pendiente', 'en revision', 'en proceso', 'esperando'];
    const dangerStates = ['rechazado', 'error', 'fallido', 'bloqueado', 'cancelado'];
    const inactiveStates = ['inactivo', 'deshabilitado', 'pausado'];

    if (positiveStates.includes(estado)) {
      return ColorChip.SUCCESS;
    } else if (warningStates.includes(estado)) {
      return ColorChip.WARNING;
    } else if (dangerStates.includes(estado)) {
      return ColorChip.DANGER;
    } else if (inactiveStates.includes(estado)) {
      return ColorChip.MEDIUM;
    }

    return ColorChip.PRIMARY;
  }
}