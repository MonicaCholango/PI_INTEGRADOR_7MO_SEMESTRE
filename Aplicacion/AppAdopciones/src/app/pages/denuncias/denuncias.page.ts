import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {AlertController, IonicModule, ToastController} from '@ionic/angular';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Ciudad} from "../../models/interfaces";
import {API_CONSTANTS} from "../../models/constants";

@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.page.html',
  styleUrls: ['./denuncias.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class DenunciasPage {
  form = {
    denunciante_nombre: '',
    denunciante_email: '',
    denunciante_telefono: '',
    direccion: '',
    observaciones: '',
    ciudad_id: '',
    tipo_mascota_id: ''
  };
  cargando = false;

  ciudades: any[] = [];
  tiposMascota: any[] = [];

  base64Image: string | null = null;
  filename: string | null = null;
  preview: string | null = null;

  constructor(private http: HttpClient, private alertCtrl: AlertController, private apiService: ApiService,
              private toastController: ToastController) {
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;

    try {
      await Promise.all([
        this.cargarTiposMascota(),
        this.cargarCiudades()
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


  cargarCiudades(): Promise<void> {
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

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    const format = image.format?.toLowerCase() || 'jpeg';
    const ext = format === 'jpeg' ? 'jpg' : format;
    this.filename = this.uuid() + '.' + ext;
    this.base64Image = `data:image/${format};base64,${image.base64String}`;
    this.preview = this.base64Image;
  }

  async enviar() {
    const formData = new FormData();
    formData.append('denunciante_nombre', this.form.denunciante_nombre);
    formData.append('denunciante_email', this.form.denunciante_email);
    formData.append('denunciante_telefono', this.form.denunciante_telefono);
    formData.append('direccion', this.form.direccion);
    formData.append('observaciones', this.form.observaciones);
    formData.append('ciudad_id', this.form.ciudad_id);
    formData.append('tipo_mascota_id', this.form.tipo_mascota_id);
    if (this.base64Image && this.filename) {
      formData.append('foto', this.base64Image);
      formData.append('filename', this.filename);
    }

    await await this.http.post(API_CONSTANTS.BASE_URL + 'adopciones.php?action=save_denuncia', formData).toPromise();

    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message: 'Denuncia enviada correctamente.',
      buttons: ['OK']
    });
    await alert.present();

    this.form = {
      denunciante_nombre: '',
      denunciante_email: '',
      denunciante_telefono: '',
      direccion: '',
      observaciones: '',
      ciudad_id: '',
      tipo_mascota_id: ''
    };
    this.preview = null;
    this.filename = null;
    this.base64Image = null;
  }

  private uuid(): string {
    return 'xxxxxxxyxxxx'.replace(/[xy]/g, (c) => (Math.random() * 16 | 0).toString(16));
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
