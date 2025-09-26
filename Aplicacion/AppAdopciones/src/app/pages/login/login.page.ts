import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastController, LoadingController, IonPopover} from '@ionic/angular';
import {ApiService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';
import {Ciudad} from '../../models/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  @ViewChild('fechaPopover', { static: false }) fechaPopover!: IonPopover;

  loginForm: FormGroup;
  registroForm: FormGroup;
  mostrarRegistro = false;
  ciudades: Ciudad[] = [];
  
  // Variables para el calendario
  mostrarCalendario = false;
  fechaSeleccionada = '';
  fechaMaxima: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registroForm = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      telefono: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required]],
      ciudad_id: ['', [Validators.required]]
    });

    // Establecer fecha máxima (18 años atrás)
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.fechaMaxima = maxDate.toISOString();
  }

  ngOnInit() {
    this.cargarCiudades();

    this.authService.getUsuarioActual().subscribe(usuario => {
      if (usuario) {
        if (usuario.tipoUsuario === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
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
        this.mostrarToast('Error al cargar ciudades', 'warning');
      }
    });
  }

  // Funciones para el calendario mejorado
  openDatePicker() {
    this.mostrarCalendario = true;
  }

  cerrarCalendario() {
    this.mostrarCalendario = false;
  }

  onFechaChange(event: any) {
    const fecha = event.detail.value;
    if (fecha) {
      // Formatear la fecha para mostrar
      const fechaObj = new Date(fecha);
      this.fechaSeleccionada = fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
      
      // Actualizar el formulario
      this.registroForm.patchValue({
        fechaNacimiento: fecha.split('T')[0] // Solo la parte de la fecha
      });
      
      // Cerrar el popover
      this.cerrarCalendario();
    }
  }

  async onLogin() {
    console.log('Iniciando login...', {
      formValid: this.loginForm.valid,
      formValue: this.loginForm.value
    });

    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...'
      });
      await loading.present();

      const email = this.loginForm.value.email?.trim();
      const password = this.loginForm.value.password;

      console.log('Datos de login:', {email, password: '***'});

      this.apiService.login(email, password).subscribe({
        next: async (response) => {
          console.log('Respuesta del servidor:', response);
          await loading.dismiss();
          const usuario = response.data?.usuario;
          if (response.success && usuario) {
            console.log('Login exitoso, usuario:', usuario);

            const loginSuccess = await this.authService.login(usuario);

            if (loginSuccess) {
              this.mostrarToast('Sesión iniciada correctamente', 'success');

              if (usuario.tipoUsuario === 'admin') {
                console.log('Redirigiendo a admin...');
                this.router.navigate(['/admin']);
              } else {
                console.log('Redirigiendo a home...');
                this.router.navigate(['/home']);
              }
            } else {
              this.mostrarToast('Error al procesar el login', 'danger');
            }
          } else {
            console.log('Login fallido:', response);
            this.mostrarToast(response.message || 'Credenciales incorrectas', 'danger');
          }
        },
        error: async (error) => {
          console.error('Error en login:', error);
          await loading.dismiss();

          let errorMessage = 'Error al iniciar sesión';
          if (error.status === 0) {
            errorMessage = 'No se puede conectar al servidor. Verifica que tu servidor esté corriendo en http://localhost/Pae/';
          } else if (error.status === 401) {
            errorMessage = 'Email o contraseña incorrectos';
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.mostrarToast(errorMessage, 'danger');
        }
      });
    } else {
      console.log('Formulario inválido:', this.loginForm.errors);
      this.mostrarToast('Por favor complete todos los campos correctamente', 'warning');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  async onRegistro() {
    if (this.registroForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Registrando usuario...'
      });
      await loading.present();

      const usuario = {
        ...this.registroForm.value,
        tipoUsuario: 'adoptante' as const,
        estado: 'activo' as const
      };

      this.apiService.registrarUsuario(usuario).subscribe({
        next: async (response) => {
          await loading.dismiss();
          if (response.success) {
            this.mostrarToast('Usuario registrado correctamente. Contraseña temporal: 123456', 'success');
            this.mostrarRegistro = false;
            this.registroForm.reset();
            this.fechaSeleccionada = ''; // Limpiar la fecha seleccionada
          } else {
            this.mostrarToast(response.message || 'Error al registrar usuario', 'danger');
          }
        },
        error: async (error) => {
          await loading.dismiss();
          this.mostrarToast('Error al registrar usuario', 'danger');
          console.error('Error registro:', error);
        }
      });
    } else {
      this.mostrarToast('Por favor complete todos los campos correctamente', 'warning');
      this.marcarCamposComoTocados();
    }
  }

  marcarCamposComoTocados() {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
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

  toggleRegistro() {
    this.mostrarRegistro = !this.mostrarRegistro;
    this.loginForm.reset();
    this.registroForm.reset();
    this.fechaSeleccionada = ''; // Limpiar la fecha cuando se cambia de formulario
    this.cerrarCalendario(); // Asegurar que el calendario se cierre
  }

  irAHome() {
    this.router.navigate(['/home']);
  }

  goRecoverPass() {
    this.router.navigate(['/recover-pass']);
  }
}