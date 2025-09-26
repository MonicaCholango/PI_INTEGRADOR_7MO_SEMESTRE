import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Solicitud, Usuario } from '../../models/interfaces';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
  standalone: false
})
export class SolicitudesPage implements OnInit {
  solicitudes: Solicitud[] = [];
  usuario: Usuario | null = null;
  cargando = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      if (usuario) {
        this.cargarSolicitudes();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async cargarSolicitudes() {
    if (!this.usuario) return;

    this.cargando = true;
    
    this.apiService.obtenerSolicitudesUsuario(this.usuario.id!).subscribe({
      next: (solicitudes) => {
        this.solicitudes = solicitudes;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.mostrarToast('Error al cargar solicitudes', 'danger');
        this.cargando = false;
      }
    });
  }


  onImageError(event: any) {
    event.target.src = 'assets/images/mascota-default.jpg';
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Aprobado': return 'success';
      case 'Pendiente': return 'warning';
      case 'En revision': return 'primary';
      case 'Rechazado': return 'danger';
      case 'Cancelado': return 'medium';
      default: return 'primary';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'Aprobado': return 'checkmark-circle';
      case 'Pendiente': return 'time';
      case 'En revision': return 'eye';
      case 'Rechazado': return 'close-circle';
      case 'Cancelado': return 'ban';
      default: return 'help-circle';
    }
  }

  getEstadoDescripcion(estado: string): string {
    switch (estado) {
      case 'Aprobado': return '¡Felicidades! Tu solicitud ha sido aprobada. Pronto te contactaremos para coordinar la entrega de tu nueva mascota.';
      case 'Pendiente': return 'Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos cualquier actualización.';
      case 'En revision': return 'Estamos evaluando tu solicitud con más detalle. Puede que te contactemos para información adicional.';
      case 'Rechazado': return 'Lo sentimos, tu solicitud no pudo ser aprobada en esta ocasión. Puedes solicitar otras mascotas disponibles.';
      case 'Cancelado': return 'La solicitud ha sido cancelada.';
      default: return 'Estado de la solicitud';
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Fecha no disponible';
    
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  doRefresh(event: any) {
    this.cargarSolicitudes();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  irAMascotas() {
    this.router.navigate(['/mascotas']);
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }
}