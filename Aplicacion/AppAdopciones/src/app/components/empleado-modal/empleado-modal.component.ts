import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController, ToastController} from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {HeaderService} from "../main-layout/header.service";
import {NgForOf} from "@angular/common";

const defaultEmpleado = {
  nombres: '',
  apellidos: '',
  cedula: '',
  correo: '',
  telefono: '',
  celular: '',
  fecha_nacimiento: '',
  centro_id: null,
  ciudad_id: null,
  area: ''
};

@Component({
  selector: 'app-empleado-modal',
  imports: [
    IonicModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './empleado-modal.component.html'
})
export class EmpleadoModalComponent implements OnInit {
  @Input() empleado: any = defaultEmpleado;
  @Input() editar: boolean = false;


  @Input() centros: any[] = [];
  @Input() ciudades: any[] = [];

  constructor(private modalCtrl: ModalController, private apiService: ApiService,
              private toastController: ToastController, private headerService: HeaderService,
              private modalController: ModalController) {
  }

  ngOnInit() {
    this.headerService.data$.subscribe(t => {
      this.centros = t.centros;
      this.ciudades = t.ciudades;
    });
    if (!this.editar) {
      this.empleado = defaultEmpleado;
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    this.apiService.guardarEmpleado(this.empleado).subscribe({
      next: async (response: any) => {

        if (response.success) {
          this.mostrarToast(`Empleado ${this.editar ? 'actualizado' : 'creado'} correctamente`, 'success');
        } else {
          this.mostrarToast('Error al guardar empleado', 'danger');
        }

        await this.modalController.dismiss();
      },
      error: async (error: any) => {
        this.mostrarToast('Error al crear empleado', 'danger');
        console.error('Error:', error);
      }
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

  protected readonly JSON = JSON;
}
