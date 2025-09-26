import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Usuario, Ciudad } from '../../models/interfaces';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false 
})
export class PerfilPage implements OnInit {
  perfilForm: FormGroup;
  usuario: Usuario | null = null;
  ciudades: Ciudad[] = [];
  editando = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.perfilForm = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      cedula: [''],
      telefono: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      fechaNacimiento: [''],
      ciudad_id: ['', [Validators.required]],
      area: [''] 
    });
  }

  ngOnInit() {
    this.cargarCiudades();
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      if (usuario) {
        this.cargarDatosFormulario();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  cargarCiudades() {
    this.apiService.obtenerCiudades().subscribe({
      next: (ciudades) => {
        this.ciudades = ciudades;
      },
      error: (error) => {
        console.error('Error al cargar ciudades:', error);
      }
    });
  }

  cargarDatosFormulario() {
    if (this.usuario) {
      this.perfilForm.patchValue({
        nombres: this.usuario.nombres,
        apellidos: this.usuario.apellidos,
        cedula: this.usuario.cedula,
        telefono: this.usuario.telefono,
        celular: this.usuario.celular,
        correo: this.usuario.correo,
        fechaNacimiento: this.usuario.fecha_nacimiento,
        ciudad_id: this.usuario.ciudad_id,
        area: this.usuario.area || ''
      });

      
      this.perfilForm.get('cedula')?.disable();
    }
  }

  toggleEdicion() {
    this.editando = !this.editando;
    if (!this.editando) {
      this.cargarDatosFormulario(); 
    }
  }

  async guardarCambios() {
    if (this.perfilForm.valid && this.usuario) {
      const loading = await this.loadingController.create({
        message: 'Actualizando perfil...'
      });
      await loading.present();

      const datosActualizados = {
        ...this.usuario,
        ...this.perfilForm.value,
        cedula: this.usuario.cedula 
      };

      this.apiService.actualizarUsuario(this.usuario.id!, datosActualizados).subscribe({
        next: async (response) => {
          await loading.dismiss();
          if (response.success) {
            await this.authService.actualizarUsuario(datosActualizados);
            this.editando = false;
            this.mostrarToast('Perfil actualizado correctamente', 'success');
          } else {
            this.mostrarToast(response.message || 'Error al actualizar perfil', 'danger');
          }
        },
        error: async (error) => {
          await loading.dismiss();
          this.mostrarToast('Error al actualizar perfil', 'danger');
          console.error('Error:', error);
        }
      });
    } else {
      this.mostrarToast('Por favor complete todos los campos requeridos', 'warning');
    }
  }

  async cambiarPassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      message: 'Ingresa tu nueva contraseña',
      inputs: [
        {
          name: 'passwordActual',
          type: 'password',
          placeholder: 'Contraseña actual',
          attributes: {
            required: true
          }
        },
        {
          name: 'passwordNueva',
          type: 'password',
          placeholder: 'Nueva contraseña',
          attributes: {
            required: true,
            minlength: 6
          }
        },
        {
          name: 'passwordConfirmar',
          type: 'password',
          placeholder: 'Confirmar nueva contraseña',
          attributes: {
            required: true,
            minlength: 6
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cambiar',
          handler: (data) => {
            if (!data.passwordActual || !data.passwordNueva || !data.passwordConfirmar) {
              this.mostrarToast('Todos los campos son requeridos', 'warning');
              return false;
            }
            
            if (data.passwordNueva !== data.passwordConfirmar) {
              this.mostrarToast('Las contraseñas no coinciden', 'warning');
              return false;
            }
            
            if (data.passwordNueva.length < 6) {
              this.mostrarToast('La contraseña debe tener al menos 6 caracteres', 'warning');
              return false;
            }
            
            this.procesarCambioPassword(data.passwordActual, data.passwordNueva);
            return true;
          }
        }
      ]
    });
    
    await alert.present();
  }

  async procesarCambioPassword(passwordActual: string, passwordNueva: string) {
    const loading = await this.loadingController.create({
      message: 'Cambiando contraseña...'
    });
    await loading.present();


    setTimeout(async () => {
      await loading.dismiss();
      this.mostrarToast('Funcionalidad disponible próximamente', 'warning');
    }, 1000);
  }

  async confirmarCerrarSesion() {
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
          handler: () => {
            this.cerrarSesion();
          }
        }
      ]
    });
    
    await alert.present();
  }

  async cerrarSesion() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...'
    });
    await loading.present();

    await this.authService.logout();
    await loading.dismiss();
    
    this.router.navigate(['/home']);
    this.mostrarToast('Sesión cerrada correctamente', 'success');
  }


  getCentroNombre(): string {
    if (this.usuario?.tipoUsuario === 'admin' && this.usuario.centro_id) {
      const centro = this.ciudades.find(c => c.id === this.usuario?.centro_id);
      return centro?.nombre || 'No especificado';
    }
    return 'No aplicable';
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
}