import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HeaderService } from '../main-layout/header.service';
import { AuthService } from '../../services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { API_CONSTANTS } from '../../models/constants';
import { HttpClient } from '@angular/common/http';

const defaultEvento = {
  titulo: '',
  descripcion: '',
  direccion: '',
  fecha_evento: null,
  fecha_fin_evento: null,
  fecha_fin_vigencia: null,
  tipo_evento: 'Evento',
  ciudad_id: null,
  centro_id: null,
  contacto_telefono: '',
  contacto_email: '',
  url_externa: '',
  cupo_maximo: null,
  tags: '',
  requiere_registro: false,
  destacado: false
};

@Component({
  selector: 'app-evento-modal',
  templateUrl: './evento-modal.page.html',
  styleUrls: ['./evento-modal.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ]
})
export class EventoModalComponent implements OnInit {
  @Input() evento: any = {};
  @Input() editar: boolean = false;
  @Input() data = {
    ciudades: [] as any[],
    centros: [] as any[]
  };

  cargando = false;
  base64Image: string | null = null;
  preview: string | null = null;
  usuario: any = null;

  // Variables para el date picker
  mostrarDatePicker = false;
  campoFechaActual: string = '';
  fechaTemporal: string | null = null;

  constructor(
    private modalCtrl: ModalController,
    private headerService: HeaderService,
    private apiService: ApiService,
    private toastController: ToastController,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.editar) {
      this.evento = { ...defaultEvento };
      // Establecer fecha por defecto (mañana)
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);
      mañana.setHours(10, 0, 0, 0);
      this.evento.fecha_evento = mañana.toISOString();

      // Fecha de vigencia por defecto (30 días)
      const vigencia = new Date();
      vigencia.setDate(vigencia.getDate() + 30);
      vigencia.setHours(23, 59, 59, 999);
      this.evento.fecha_fin_vigencia = vigencia.toISOString();
    }

    this.headerService.data$.subscribe(t => {
      this.data = {
        ciudades: t.ciudades || [],
        centros: t.centros || []
      };
    });

    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      if (!this.editar && usuario) {
        this.evento.creado_por = usuario.id;
      }
    });

    // Si está editando y tiene foto, mostrar preview
    if (this.editar && this.evento.foto) {
      this.preview = `${API_CONSTANTS.BASE_URL}uploads/eventos/${this.evento.foto}`;
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  puedeGuardar(): boolean {
    return !!(
      this.evento.titulo?.trim() &&
      this.evento.descripcion?.trim() &&
      this.evento.fecha_evento &&
      this.evento.fecha_fin_vigencia
    );
  }

  // Métodos para el date picker
  abrirDatePicker(campo: string) {
    this.campoFechaActual = campo;
    
    // Establecer la fecha actual del campo
    let fechaActual = this.evento[campo];
    if (!fechaActual) {
      // Fechas por defecto según el campo
      const ahora = new Date();
      switch (campo) {
        case 'fecha_evento':
          ahora.setDate(ahora.getDate() + 1);
          ahora.setHours(10, 0, 0, 0);
          break;
        case 'fecha_fin_evento':
          ahora.setDate(ahora.getDate() + 1);
          ahora.setHours(18, 0, 0, 0);
          break;
        case 'fecha_fin_vigencia':
          ahora.setDate(ahora.getDate() + 30);
          ahora.setHours(23, 59, 0, 0);
          break;
      }
      fechaActual = ahora.toISOString();
    }
    
    this.fechaTemporal = fechaActual;
    this.mostrarDatePicker = true;
  }

  cerrarDatePicker() {
    this.mostrarDatePicker = false;
    this.campoFechaActual = '';
    this.fechaTemporal = null;
  }

  onFechaSeleccionada(event: any) {
    this.fechaTemporal = event.detail.value;
  }

  confirmarFecha() {
    if (this.fechaTemporal && this.campoFechaActual) {
      this.evento[this.campoFechaActual] = this.fechaTemporal;
    }
    this.cerrarDatePicker();
  }

  getTituloDatePicker(): string {
    switch (this.campoFechaActual) {
      case 'fecha_evento':
        return 'Fecha del Evento';
      case 'fecha_fin_evento':
        return 'Fecha de Finalización';
      case 'fecha_fin_vigencia':
        return 'Vigente Hasta';
      default:
        return 'Seleccionar Fecha';
    }
  }

  formatearFechaParaMostrar(fecha: string | null): string {
    if (!fecha) return '';
    
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
      return '';
    }
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
        allowEditing: true,
        width: 800,
        height: 600
      });

      const format = image.format?.toLowerCase() || 'jpeg';
      this.base64Image = `data:image/${format};base64,${image.base64String}`;
      this.preview = this.base64Image;

    } catch (error) {
      console.error('Error al tomar foto:', error);
      this.mostrarToast('Error al seleccionar foto', 'danger');
    }
  }

  removerFoto() {
    this.base64Image = null;
    this.preview = null;
  }

  async guardar() {
    if (!this.puedeGuardar()) {
      this.mostrarToast('Complete todos los campos obligatorios', 'warning');
      return;
    }

    // Validaciones adicionales
    if (this.evento.fecha_evento && this.evento.fecha_fin_evento) {
      const fechaInicio = new Date(this.evento.fecha_evento);
      const fechaFin = new Date(this.evento.fecha_fin_evento);
      
      if (fechaFin <= fechaInicio) {
        this.mostrarToast('La fecha de finalización debe ser posterior a la fecha de inicio', 'warning');
        return;
      }
    }

    if (this.evento.fecha_evento && this.evento.fecha_fin_vigencia) {
      const fechaEvento = new Date(this.evento.fecha_evento);
      const fechaVigencia = new Date(this.evento.fecha_fin_vigencia);
      
      if (fechaVigencia < fechaEvento) {
        this.mostrarToast('La fecha de vigencia debe ser igual o posterior a la fecha del evento', 'warning');
        return;
      }
    }

    this.cargando = true;

    try {
      const eventoData = {
        ...this.evento,
        creado_por: this.usuario?.id
      };

      const response = await (this.editar 
        ? this.apiService.actualizarEvento(eventoData)
        : this.apiService.agregarEvento(eventoData)
      ).toPromise();

      if (response?.success) {
        const eventoId = this.editar ? this.evento.id : response.data?.id;
        
        if (this.base64Image && eventoId) {
          await this.subirFoto(eventoId);
        }

        this.mostrarToast(
          `Evento ${this.editar ? 'actualizado' : 'creado'} correctamente`, 
          'success'
        );
        this.modalCtrl.dismiss({ success: true });

      } else {
        this.mostrarToast('Error al guardar evento', 'danger');
      }

    } catch (error) {
      console.error('Error al guardar evento:', error);
      this.mostrarToast('Error al guardar evento', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  private async subirFoto(eventoId: number) {
    if (!this.base64Image) return;

    try {
      const formData = new FormData();
      formData.append('foto', this.base64Image);
      formData.append('id_evento', eventoId.toString());
      formData.append('extension', 'jpg');

      await this.http.post(
        API_CONSTANTS.BASE_URL + 'adopciones.php?action=save_foto_evento', 
        formData
      ).toPromise();

    } catch (error) {
      console.error('Error al subir foto:', error);
      this.mostrarToast('Evento guardado pero error al subir foto', 'warning');
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}