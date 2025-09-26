import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastController, LoadingController, AlertController, MenuController} from '@ionic/angular';
import {ModalController} from '@ionic/angular';
import {ActionSheetController} from '@ionic/angular';
import {ApiService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';
import {
  Usuario,
  Mascota,
  Solicitud,
  Centro,
  Ciudad,
  TipoMascota,
  Estado,
  EstadoAdopcion,
  Salud
} from '../../models/interfaces';
import {PhotoService} from "../../services/photo.service";
import {CameraSource} from "@capacitor/camera";
import {HeaderService} from "../../components/main-layout/header.service";
import {EmpleadoModalComponent} from "../../components/empleado-modal/empleado-modal.component";
import {MascotaModalComponent} from "../../components/mascota-modal/mascota-modal.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {
  vistaActual = 'dashboard';
  usuario: Usuario | null = null;
  cargando = false;

  usuarios: Usuario[] = [];
  mascotas: Mascota[] = [];
  solicitudes: Solicitud[] = [];
  solicitudesRecientes: Solicitud[] = [];
  centros: Centro[] = [];
  ciudades: Ciudad[] = [];
  tiposMascota: TipoMascota[] = [];
  estados: Estado[] = [];
  estadosAdopcion: EstadoAdopcion[] = [];
  estadosSalud: Salud[] = [];
  empleados: Usuario[] = [];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private menuController: MenuController,
    private apiService: ApiService,
    private authService: AuthService,
    private photoService: PhotoService,
    private actionSheetCtrl: ActionSheetController,
    private headerService: HeaderService,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.headerService.vistaActual$.subscribe(v => this.vistaActual = v);
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      if (!usuario || usuario.tipoUsuario !== 'admin') {
        this.router.navigate(['/home']);
      } else {
        this.cargarTodosLosDatos();
        this.cargarCatalogos();
      }
    });
  }

  navegarA(vista: string) {
    this.headerService.setVistaActual(vista);
  }

  async cargarTodosLosDatos() {
    this.cargando = true;

    try {
      await Promise.all([
        this.cargarUsuarios(),
        this.cargarMascotas(),
        this.cargarSolicitudes(),
        this.cargarCentros(),
        this.cargarCiudades(),
        this.cargarTipos()
      ]);

      this.solicitudesRecientes = this.solicitudes
        .sort((a, b) => new Date(b.fecha_solicitud).getTime() - new Date(a.fecha_solicitud).getTime())
        .slice(0, 5);

      this.headerService.setData({
        usuarios: this.usuarios,
        mascotas: this.mascotas,
        solicitudes: this.solicitudes,
        tiposMascota: this.tiposMascota,
        centros: this.centros,
        ciudades: this.ciudades,
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarToast('Error al cargar datos', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  private async cargarUsuarios(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerUsuarios().subscribe({
        next: (usuarios: Usuario[]) => {
          this.usuarios = usuarios;
          resolve();
        },
        error: reject
      });
    });
  }

  private async cargarMascotas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerMascotas().subscribe({
        next: (mascotas: Mascota[]) => {
          this.mascotas = mascotas;
          resolve();
        },
        error: reject
      });
    });
  }

  private async cargarSolicitudes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerSolicitudes().subscribe({
        next: (solicitudes: Solicitud[]) => {
          this.solicitudes = solicitudes;
          resolve();
        },
        error: reject
      });
    });
  }

  private async cargarCentros(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerCentros().subscribe({
        next: (centros: Centro[]) => {
          this.centros = centros;
          resolve();
        },
        error: reject
      });
    });
  }

  private async cargarCiudades(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerCiudades().subscribe({
        next: (ciudades: Ciudad[]) => {
          this.ciudades = ciudades;
          resolve();
        },
        error: reject
      });
    });
  }

  private async cargarTipos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerTiposMascota().subscribe({
        next: (tipos: TipoMascota[]) => {
          this.tiposMascota = tipos;
          resolve();
        },
        error: reject
      });
    });
  }

  async cargarCatalogos() {
    try {
      const promises = [
        this.cargarEstadosCatalogo(),
        this.cargarEstadosSaludCatalogo(),
        this.cargarEmpleadosCatalogo()
      ];
      await Promise.all(promises);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  }

  private async cargarEstadosCatalogo(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.obtenerEstados().subscribe({
        next: (estados) => {
          this.estados = estados;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  private async cargarEstadosSaludCatalogo(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.obtenerEstadosSalud().subscribe({
        next: (estados) => {
          this.estadosSalud = estados;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  private async cargarEmpleadosCatalogo(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.obtenerEmpleados().subscribe({
        next: (empleados) => {
          this.empleados = empleados;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  async editarUsuario(usuario: Usuario) {

    if (usuario.tipoUsuario == 'admin') {
      await this.abrirModalEmpleado(true, usuario);
      return;
    }
    const alert = await this.alertController.create({
      header: 'Editar Usuario',
      inputs: [
        {
          name: 'nombres',
          type: 'text',
          placeholder: 'Nombres',
          value: usuario.nombres
        },
        {
          name: 'apellidos',
          type: 'text',
          placeholder: 'Apellidos',
          value: usuario.apellidos
        },
        {
          name: 'telefono',
          type: 'tel',
          placeholder: 'Teléfono',
          value: usuario.telefono
        },
        {
          name: 'celular',
          type: 'tel',
          placeholder: 'Celular',
          value: usuario.celular
        },
        {
          name: 'correo',
          type: 'email',
          placeholder: 'Email',
          value: usuario.correo
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.actualizarUsuario(usuario.id!, {...usuario, ...data});
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarUsuario(usuario: Usuario) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar al usuario ${usuario.nombres} ${usuario.apellidos}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.procesarEliminarUsuario(usuario.id!, usuario.tipoUsuario);
          }
        }
      ]
    });

    await alert.present();
  }

  private async actualizarUsuario(id: number, datosUsuario: Usuario) {
    const loading = await this.loadingController.create({
      message: 'Actualizando usuario...'
    });
    await loading.present();

    this.apiService.actualizarUsuario(id, datosUsuario).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Usuario actualizado correctamente', 'success');
          await this.cargarUsuarios();
        } else {
          this.mostrarToast('Error al actualizar usuario', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar usuario', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async cambiarEstadoUsuario(usuario: Usuario) {
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    const alert = await this.alertController.create({
      header: `Confirmar ${accion}`,
      message: `¿Deseas ${accion} al usuario ${usuario.nombres} ${usuario.apellidos}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.procesarCambioEstadoUsuario(usuario.id!, nuevoEstado, usuario.tipoUsuario);
          }
        }
      ]
    });

    await alert.present();
  }

  private async procesarCambioEstadoUsuario(id: number, estado: string, tipoUsuario: string) {
    const loading = await this.loadingController.create({
      message: 'Actualizando usuario...'
    });
    await loading.present();

    this.apiService.cambiarEstadoUsuario(id, estado, tipoUsuario).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Estado del usuario actualizado correctamente', 'success');
          await this.cargarUsuarios();
        } else {
          this.mostrarToast('Error al actualizar estado del usuario', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar estado del usuario', 'danger');
        console.error('Error:', error);
      }
    });
  }


  private async procesarEliminarUsuario(id: number, tipoUsuario: string) {
    const loading = await this.loadingController.create({
      message: 'Eliminando usuario...'
    });
    await loading.present();

    this.apiService.eliminarUsuario(id, tipoUsuario).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Usuario eliminado correctamente', 'success');
          await this.cargarUsuarios();
        } else {
          this.mostrarToast('Error al eliminar usuario', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al eliminar usuario', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async abrirModalMascota(editar: boolean, mascota: any) {
    const modal = await this.modalCtrl.create({
      component: MascotaModalComponent,
      componentProps: {
        mascota,
        editar
      }
    });
    await modal.present();
    await modal.onDidDismiss();
    await this.cargarMascotas();
  }

  async eliminarMascota(mascota: Mascota) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar a ${mascota.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.procesarEliminacionMascota(mascota.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  private async procesarEliminacionMascota(id: number) {
    const loading = await this.loadingController.create({
      message: 'Eliminando mascota...'
    });
    await loading.present();

    this.apiService.eliminarMascota(id).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Mascota eliminada correctamente', 'success');
          await this.cargarMascotas();
        } else {
          this.mostrarToast('Error al eliminar mascota', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al eliminar mascota', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async cambiarEstadoSolicitud(solicitud: Solicitud, nuevoEstado: string) {
    if (nuevoEstado === 'En revision') {
      await this.actualizarSolicitud(solicitud.id!, nuevoEstado, 'Solicitud puesta en revisión');
      await this.mostrarDetallesUsuario(solicitud);
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Cambio',
      message: `¿Cambiar estado de la solicitud a "${nuevoEstado}"?`,
      inputs: [
        {
          name: 'observaciones',
          type: 'textarea',
          placeholder: 'Observaciones (opcional)',
          value: solicitud.observaciones || ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (data: any) => {
            this.actualizarSolicitud(solicitud.id!, nuevoEstado, data.observaciones);
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarDetallesUsuario(solicitud: Solicitud) {
    const alert = await this.alertController.create({
      header: 'Detalles del Solicitante',
      message: `
        <div style="text-align: left; line-height: 1.6;">
          <h3 style="color: var(--ion-color-primary); margin-bottom: 10px;">Información Personal</h3>
          <p><strong>Nombre:</strong> ${solicitud.nombres} ${solicitud.apellidos}</p>
          <p><strong>Email:</strong> ${solicitud.correo}</p>
          <p><strong>Celular:</strong> ${solicitud.celular}</p>

          <h3 style="color: var(--ion-color-primary); margin: 15px 0 10px 0;">Mascota Solicitada</h3>
          <p><strong>Nombre:</strong> ${solicitud.mascota_nombre}</p>
          <p><strong>Tipo:</strong> ${solicitud.tipoMascota}</p>

          <h3 style="color: var(--ion-color-primary); margin: 15px 0 10px 0;">Solicitud</h3>
          <p><strong>Fecha:</strong> ${this.formatearFecha(solicitud.fecha_solicitud)}</p>
          <p><strong>Estado:</strong> ${solicitud.estado}</p>
          ${solicitud.observaciones ? `<p><strong>Observaciones:</strong> ${solicitud.observaciones}</p>` : ''}
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  private async actualizarSolicitud(id: number, estado: string, observaciones?: string) {
    const loading = await this.loadingController.create({
      message: 'Actualizando solicitud...'
    });
    await loading.present();

    this.apiService.actualizarSolicitud(id, estado, observaciones).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Solicitud actualizada correctamente', 'success');
          await this.cargarSolicitudes();
        } else {
          this.mostrarToast(response.message || 'Error al actualizar solicitud', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar solicitud', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async agregarCentro() {
    const alert = await this.alertController.create({
      header: 'Agregar Centro',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del centro'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.nombre && data.nombre.trim()) {
              this.guardarCentro(data);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editarCentro(centro: Centro) {
    const alert = await this.alertController.create({
      header: 'Editar Centro',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del centro',
          value: centro.nombre
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.actualizarCentro(centro.id!, {...centro, ...data});
          }
        }
      ]
    });

    await alert.present();
  }

  async cambiarEstadoCentro(centro: Centro) {
    const nuevoEstado = !centro.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    const alert = await this.alertController.create({
      header: `Confirmar ${accion}`,
      message: `¿Deseas ${accion} el centro "${centro.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.procesarCambioEstadoCentro(centro.id!, nuevoEstado);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarCentro(centro: Centro) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar el centro "${centro.nombre}"?`,
      subHeader: 'Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.procesarEliminacionCentro(centro.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  private async guardarCentro(data: any) {
    const loading = await this.loadingController.create({
      message: 'Agregando centro...'
    });
    await loading.present();

    this.apiService.agregarCentro(data).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Centro agregado correctamente', 'success');
          await this.cargarCentros();
        } else {
          this.mostrarToast('Error al agregar centro', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al agregar centro', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async actualizarCentro(id: number, datosActualizados: any) {
    const loading = await this.loadingController.create({
      message: 'Actualizando centro...'
    });
    await loading.present();

    this.apiService.actualizarCentro(id, datosActualizados).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Centro actualizado correctamente', 'success');
          await this.cargarCentros();
        } else {
          this.mostrarToast('Error al actualizar centro', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar centro', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async procesarCambioEstadoCentro(id: number, nuevoEstado: boolean) {
    const loading = await this.loadingController.create({
      message: 'Actualizando estado del centro...'
    });
    await loading.present();

    this.apiService.cambiarEstadoCentro(id, nuevoEstado).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Estado del centro actualizado correctamente', 'success');
          await this.cargarCentros();
        } else {
          this.mostrarToast('Error al actualizar estado del centro', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar estado del centro', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async procesarEliminacionCentro(id: number) {
    const loading = await this.loadingController.create({
      message: 'Eliminando centro...'
    });
    await loading.present();

    this.apiService.eliminarCentro(id).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Centro eliminado correctamente', 'success');
          await this.cargarCentros();
        } else {
          this.mostrarToast(response.message || 'Error al eliminar centro', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al eliminar centro', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async agregarCiudad() {
    const alert = await this.alertController.create({
      header: 'Agregar Ciudad',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la ciudad'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.nombre && data.nombre.trim()) {
              this.guardarCiudad(data);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editarCiudad(ciudad: Ciudad) {
    const alert = await this.alertController.create({
      header: 'Editar Ciudad',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la ciudad',
          value: ciudad.nombre
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.actualizarCiudad(ciudad.id!, {...ciudad, ...data});
          }
        }
      ]
    });

    await alert.present();
  }

  async cambiarEstadoCiudad(ciudad: Ciudad) {
    const nuevoEstado = !ciudad.activa;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    const alert = await this.alertController.create({
      header: `Confirmar ${accion}`,
      message: `¿Deseas ${accion} la ciudad "${ciudad.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.procesarCambioEstadoCiudad(ciudad.id!, nuevoEstado);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarCiudad(ciudad: Ciudad) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar la ciudad "${ciudad.nombre}"?`,
      subHeader: 'Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.procesarEliminacionCiudad(ciudad.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  private async guardarCiudad(data: any) {
    const loading = await this.loadingController.create({
      message: 'Agregando ciudad...'
    });
    await loading.present();

    this.apiService.agregarCiudad(data).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Ciudad agregada correctamente', 'success');
          await this.cargarCiudades();
        } else {
          this.mostrarToast('Error al agregar ciudad', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al agregar ciudad', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async actualizarCiudad(id: number, datosActualizados: any) {
    const loading = await this.loadingController.create({
      message: 'Actualizando ciudad...'
    });
    await loading.present();

    this.apiService.actualizarCiudad(id, datosActualizados).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Ciudad actualizada correctamente', 'success');
          await this.cargarCiudades();
        } else {
          this.mostrarToast('Error al actualizar ciudad', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar ciudad', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async procesarCambioEstadoCiudad(id: number, nuevoEstado: boolean) {
    const loading = await this.loadingController.create({
      message: 'Actualizando estado de la ciudad...'
    });
    await loading.present();

    this.apiService.cambiarEstadoCiudad(id, nuevoEstado).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Estado de la ciudad actualizado correctamente', 'success');
          await this.cargarCiudades();
        } else {
          this.mostrarToast('Error al actualizar estado de la ciudad', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar estado de la ciudad', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async procesarEliminacionCiudad(id: number) {
    const loading = await this.loadingController.create({
      message: 'Eliminando ciudad...'
    });
    await loading.present();

    this.apiService.eliminarCiudad(id).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Ciudad eliminada correctamente', 'success');
          await this.cargarCiudades();
        } else {
          this.mostrarToast(response.message || 'Error al eliminar ciudad', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al eliminar ciudad', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async agregarTipo() {
    const alert = await this.alertController.create({
      header: 'Agregar Tipo de Mascota',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del tipo (ej: Gato, Perro, Conejo)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.nombre && data.nombre.trim()) {
              this.guardarTipo(data);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editarTipo(tipo: TipoMascota) {
    const alert = await this.alertController.create({
      header: 'Editar Tipo de Mascota',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del tipo',
          value: tipo.nombre
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Descripción (opcional)',
          value: tipo.descripcion || ''
        },
        {
          name: 'cuidados_especiales',
          type: 'textarea',
          placeholder: 'Cuidados especiales (opcional)',
          value: tipo.cuidados_especiales || ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.actualizarTipo(tipo.id!, {...tipo, ...data});
          }
        }
      ]
    });

    await alert.present();
  }

  async cambiarEstadoTipo(tipo: TipoMascota) {
    const nuevoEstado = !tipo.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    const alert = await this.alertController.create({
      header: `Confirmar ${accion}`,
      message: `¿Deseas ${accion} el tipo de mascota "${tipo.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.procesarCambioEstadoTipo(tipo.id!, nuevoEstado);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarTipo(tipo: TipoMascota) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar el tipo "${tipo.nombre}"?`,
      subHeader: 'Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.procesarEliminacionTipo(tipo.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  private async guardarTipo(data: any) {
    const loading = await this.loadingController.create({
      message: 'Agregando tipo de mascota...'
    });
    await loading.present();

    this.apiService.agregarTipoMascota(data).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Tipo de mascota agregado correctamente', 'success');
          await this.cargarTipos();
        } else {
          this.mostrarToast('Error al agregar tipo', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al agregar tipo de mascota', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async actualizarTipo(id: number, datosActualizados: any) {
    const loading = await this.loadingController.create({
      message: 'Actualizando tipo de mascota...'
    });
    await loading.present();

    this.apiService.actualizarTipoMascota(id, datosActualizados).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Tipo de mascota actualizado correctamente', 'success');
          await this.cargarTipos();
        } else {
          this.mostrarToast('Error al actualizar tipo de mascota', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar tipo de mascota', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async procesarCambioEstadoTipo(id: number, nuevoEstado: boolean) {
    const loading = await this.loadingController.create({
      message: 'Actualizando estado del tipo...'
    });
    await loading.present();

    this.apiService.cambiarEstadoTipoMascota(id, nuevoEstado).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Estado del tipo de mascota actualizado correctamente', 'success');
          await this.cargarTipos();
        } else {
          this.mostrarToast('Error al actualizar estado del tipo', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al actualizar estado del tipo', 'danger');
        console.error('Error:', error);
      }
    });
  }

  private async procesarEliminacionTipo(id: number) {
    const loading = await this.loadingController.create({
      message: 'Eliminando tipo de mascota...'
    });
    await loading.present();

    this.apiService.eliminarTipoMascota(id).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.mostrarToast('Tipo de mascota eliminado correctamente', 'success');
          await this.cargarTipos();
        } else {
          this.mostrarToast(response.message || 'Error al eliminar tipo de mascota', 'danger');
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarToast('Error al eliminar tipo de mascota', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async generarReporte() {
    this.mostrarToast('Funcionalidad de reportes próximamente', 'warning');
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
    switch (estado?.toLowerCase()) {
      case 'aprobado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'en revision':
        return 'primary';
      case 'rechazado':
        return 'danger';
      case 'cancelado':
        return 'medium';
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'medium';
      case 'disponible':
        return 'success';
      case 'adoptado':
        return 'medium';
      case 'enfermo':
        return 'danger';
      case 'en veterinaria':
        return 'warning';
      case 'admin':
        return 'tertiary';
      case 'adoptante':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'Aprobado':
        return 'checkmark-circle';
      case 'Pendiente':
        return 'time';
      case 'En revision':
        return 'eye';
      case 'Rechazado':
        return 'close-circle';
      case 'Cancelado':
        return 'ban';
      default:
        return 'help-circle';
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';

    try {
      return new Date(fecha).toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  getTotalUsuarios(): number {
    return this.usuarios.length;
  }

  getTotalMascotas(): number {
    return this.mascotas.length;
  }

  getTotalSolicitudes(): number {
    return this.solicitudes.length;
  }

  getSolicitudesPendientes(): number {
    return this.solicitudes.filter(s => s.estado === 'Pendiente').length;
  }

  getMascotasDisponibles(): number {
    return this.mascotas.filter(m => m.estado === 'Disponible').length;
  }

  getUsuariosActivos(): number {
    return this.usuarios.filter(u => u.estado === 'activo').length;
  }

  getAdopcionesAprobadas(): number {
    return this.solicitudes.filter(s => s.estado === 'Aprobado').length;
  }

  doRefresh(event: any) {
    Promise.all([
      this.cargarTodosLosDatos(),
      this.cargarCatalogos()
    ]).finally(() => {
      event.target.complete();
    });
  }


  trackByCentroId(index: number, centro: Centro): number {
    return centro.id || index;
  }

  trackByCiudadId(index: number, ciudad: Ciudad): number {
    return ciudad.id || index;
  }

  trackByTipoId(index: number, tipo: TipoMascota): number {
    return tipo.id || index;
  }

  trackByUsuarioId(index: number, usuario: Usuario): number {
    return usuario.id || index;
  }

  trackByMascotaId(index: number, mascota: Mascota): number {
    return mascota.id || index;
  }

  trackBySolicitudId(index: number, solicitud: Solicitud): number {
    return solicitud.id || index;
  }


  async subirFoto(mascotaId?: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Subir foto',
      buttons: [
        {
          text: '📸 Tomar foto',
          handler: async () => this.showPhotoResult(await this.photoService.takeOrSelectPhoto(CameraSource.Camera, mascotaId)),
        },
        {
          text: '🖼️ Elegir desde galería',
          handler: async () => this.showPhotoResult(await this.photoService.takeOrSelectPhoto(CameraSource.Photos, mascotaId)),
        },
        {
          text: '❌ Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async showPhotoResult(result: boolean) {
    if (result) {
      await this.mostrarToast('Foto subida con exito', 'success');
      await this.cargarMascotas();
    } else {
      this.mostrarToast('Error al subir foto', 'danger');
    }
  }

  async abrirModalEmpleado(editar: boolean, empleado: any) {
    const modal = await this.modalCtrl.create({
      component: EmpleadoModalComponent,
      componentProps: {
        empleado,
        editar
      }
    });
    await modal.present();
    await modal.onDidDismiss();
    await this.cargarUsuarios();
  }

}
