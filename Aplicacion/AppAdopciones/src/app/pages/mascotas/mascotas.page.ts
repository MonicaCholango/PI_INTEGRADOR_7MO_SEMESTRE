import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, ToastController, AlertController, MenuController} from '@ionic/angular';
import {ApiService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';
import {Mascota, Usuario, TipoMascota} from '../../models/interfaces';
import {PhotoService} from "../../services/photo.service";

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
  standalone: false
})
export class MascotasPage implements OnInit {
  mascotas: Mascota[] = [];
  mascotasFiltradas: Mascota[] = [];
  tiposMascota: TipoMascota[] = [];
  usuario: Usuario | null = null;
  filtroTipo = '';
  filtroTexto = '';
  cargando = false;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private menuController: MenuController,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuario = usuario;
    });
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;

    try {
      await Promise.all([
        this.cargarTiposMascota(),
        this.cargarMascotas()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarToast('Error al cargar datos', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  cargarTiposMascota(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerTiposMascota().subscribe({
        next: (tipos) => {
          this.tiposMascota = tipos;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar tipos de mascota:', error);
          resolve();
        }
      });
    });
  }

  cargarMascotas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerMascotasDisponibles().subscribe({
        next: (mascotas) => {
          this.mascotas = mascotas;
          this.mascotasFiltradas = mascotas;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar mascotas:', error);
          reject(error);
        }
      });
    });
  }

  filtrarMascotas() {
    console.log('Filtrando mascotas...', {
      filtroTipo: this.filtroTipo,
      filtroTexto: this.filtroTexto,
      totalMascotas: this.mascotas.length
    });

    this.mascotasFiltradas = this.mascotas.filter(mascota => {
      const cumpleTipo = !this.filtroTipo ||
        !this.filtroTipo.trim() ||
        (mascota.tipoMascota && mascota.tipoMascota.toLowerCase().includes(this.filtroTipo.toLowerCase()));

      const cumpleTexto = !this.filtroTexto ||
        !this.filtroTexto.trim() ||
        this.buscarEnTexto(mascota, this.filtroTexto);

      console.log(`Mascota ${mascota.nombre}:`, {
        cumpleTipo,
        cumpleTexto,
        tipoMascota: mascota.tipoMascota,
        filtroTipo: this.filtroTipo
      });

      return cumpleTipo && cumpleTexto;
    });

    console.log('Resultado filtrado:', this.mascotasFiltradas.length);
  }

  private buscarEnTexto(mascota: Mascota, texto: string): boolean {
    const textoLower = texto.toLowerCase().trim();

    const campos = [
      mascota.nombre,
      mascota.tipoMascota,
      mascota.ciudad,
      mascota.centro,
      mascota.observaciones,
      mascota.edad,
      mascota.responsable
    ];

    return campos.some(campo =>
      campo && campo.toString().toLowerCase().includes(textoLower)
    );
  }

  async mostrarDetallesMascota(mascota: Mascota) {
    const alert = await this.alertController.create({
      header: mascota.nombre,
      cssClass: 'detalle-mascota-alert',
      message: `
      <div class="mascota-detail-content">
        <div class="mascota-header">
          <h3>${mascota.nombre}</h3>
          <p class="mascota-tipo">${mascota.tipoMascota || 'Tipo no especificado'}</p>
        </div>

        <div class="info-grid">
          <div class="info-row">
            <strong>🐾 Tipo:</strong>
            <span>${mascota.tipoMascota || 'No especificado'}</span>
          </div>

          <div class="info-row">
            <strong>⏰ Edad:</strong>
            <span>${mascota.edad || 'No especificada'}</span>
          </div>

          <div class="info-row">
            <strong>💚 Estado:</strong>
            <span class="estado-${(mascota.estado || '').toLowerCase().replace(' ', '-')}">${mascota.estado || 'No especificado'}</span>
          </div>

          <div class="info-row">
            <strong>🏥 Salud:</strong>
            <span>${mascota.salud || 'No especificada'}</span>
          </div>

          <div class="info-row">
            <strong>📍 Ciudad:</strong>
            <span>${mascota.ciudad || 'No especificada'}</span>
          </div>

          <div class="info-row">
            <strong>🏢 Centro:</strong>
            <span>${mascota.centro || 'No especificado'}</span>
          </div>

          <div class="info-row">
            <strong>👨‍⚕️ Responsable:</strong>
            <span>${mascota.responsable || 'No especificado'}</span>
          </div>

          ${mascota.observaciones ? `
            <div class="observaciones-section">
              <strong>📝 Observaciones:</strong>
              <p>${mascota.observaciones}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: mascota.estado === 'Disponible' ? 'Solicitar Adopción' : 'No Disponible',
          cssClass: mascota.estado === 'Disponible' ? 'primary' : 'disabled',
          handler: () => {
            if (mascota.estado === 'Disponible') {
              this.solicitarAdopcion(mascota);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async solicitarAdopcion(mascota: Mascota) {
    if (mascota.estado !== 'Disponible') {
      this.mostrarToast('Esta mascota no está disponible para adopción', 'warning');
      return;
    }

    if (!this.usuario) {
      const loginAlert = await this.alertController.create({
        header: 'Inicia Sesión Requerida',
        message: 'Para completar tu solicitud de adopción, necesitas iniciar sesión en tu cuenta.',
        cssClass: 'login-required-alert',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Iniciar Sesión',
            cssClass: 'primary',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }
        ]
      });
      await loginAlert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: `Adoptar a ${mascota.nombre}`,
      message: `
      <div class="solicitud-form">
        <p><strong>¿Por qué quieres adoptar a ${mascota.nombre}?</strong></p>
        <p class="required-note">* Campo obligatorio</p>
      </div>
    `,
      cssClass: 'solicitud-adopcion-alert',
      inputs: [
        {
          name: 'observaciones',
          type: 'textarea',
          placeholder: 'Cuéntanos por qué quieres adoptar a esta mascota... *',
          attributes: {
            required: true,
            minlength: 10,
            maxlength: 500,
            rows: 4
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Enviar Solicitud',
          cssClass: 'primary',
          handler: (data) => {
            if (!data.observaciones || data.observaciones.trim().length < 10) {
              this.mostrarToast('Debes escribir al menos 10 caracteres explicando por qué quieres adoptar a esta mascota', 'warning');
              return false;
            }

            this.procesarSolicitud(mascota, data.observaciones.trim());
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  private async procesarSolicitud(mascota: Mascota, observaciones: string) {
    if (!this.usuario) {
      const loginAlert = await this.alertController.create({
        header: 'Inicia Sesión Requerida',
        message: 'Para completar tu solicitud de adopción, necesitas iniciar sesión en tu cuenta.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Iniciar Sesión',
            cssClass: 'primary',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }
        ]
      });
      await loginAlert.present();
      return;
    }

    this.crearSolicitud(mascota, observaciones);
  }

  async crearSolicitud(mascota: Mascota, observaciones: string) {
    if (!this.usuario) return;

    const solicitud = {
      mascota_id: mascota.id!,
      usuario_id: this.usuario.id!,
      usuario_tipo: 'adoptante' as const,
      estado: 'Pendiente' as const,
      fecha_solicitud: new Date().toISOString(),
      observaciones: observaciones
    };

    this.apiService.crearSolicitud(solicitud).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarToast('¡Solicitud enviada exitosamente! Te contactaremos pronto.', 'success');
          this.cargarDatos();
        } else {
          this.mostrarToast(response.message || 'Error al enviar solicitud', 'danger');
        }
      },
      error: (error) => {
        console.error('Error al crear solicitud:', error);
        this.mostrarToast('Error al enviar solicitud', 'danger');
      }
    });
  }

  async closeMenu() {
    await this.menuController.close();
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/home']);
            this.mostrarToast('Sesión cerrada correctamente', 'success');
            this.closeMenu();
          }
        }
      ]
    });
    await alert.present();
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

  doRefresh(event: any) {
    this.cargarDatos().finally(() => {
      event.target.complete();
    });
  }

  irAHome() {
    this.router.navigate(['/home']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }
}
