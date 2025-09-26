import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController, ToastController} from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {HeaderService} from "../main-layout/header.service";
import {ApiService} from "../../services/api.service";
import {NgForOf} from "@angular/common";
import {Estado, EstadoAdopcion, Salud, TipoMascota} from "../../models/interfaces";

const defaultMascota = {
  nombre: '',
  raza: '',
  edad: '',
  sexo: '',
  descripcion: '',
  tipo_mascota_id: 1,
  centro_id: null,
}

@Component({
  selector: 'app-mascota-modal',
  templateUrl: './mascota-modal.component.html',
  imports: [
    IonicModule,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./mascota-modal.component.scss']
})
export class MascotaModalComponent implements OnInit {
  @Input() mascota: any = {};
  @Input() editar: boolean = false;

  // Este objeto ya viene cargado en tu componente padre
  @Input() data = {
    estados: [] as Estado[],
    estadosSalud: [] as Salud[],
    estadosAdopcion: [] as any[],
    usuarios: [] as any[],
    tiposMascota: [] as TipoMascota[],
    centros: [] as any[],
    ciudades: [] as any[]
  };

  constructor(private modalCtrl: ModalController, private headerService: HeaderService, private apiService: ApiService,
              private toastController: ToastController,
  ) {
  }

  ngOnInit() {
    // Si estás creando y mascota no tiene datos, asegúrate de inicializar campos mínimos
    if (!this.editar) {
      this.mascota = defaultMascota;
    }

    this.headerService.data$.subscribe(t => {
      this.data = {...t,
        estados: this.data.estados,
        estadosSalud: this.data.estadosSalud,
        estadosAdopcion: this.data.estadosAdopcion
      };

    });

    this.apiService.obtenerTiposMascota().subscribe({
      next: (tipos) => {
        this.data.tiposMascota = tipos;
      },
    });

    this.apiService.obtenerEstados().subscribe({
      next: (tipos) => {
        this.data.estados = tipos;
      },
    });

    this.apiService.obtenerEstadosSalud().subscribe({
      next: (tipos) => {
        this.data.estadosSalud = tipos;
      },
    });

    this.apiService.obtenerEstadosAdopcion().subscribe({
      next: (tipos) => {
        this.data.estadosAdopcion = tipos;
      },
    });
  }


  cerrar() {
    this.modalCtrl.dismiss();
  }


  async guardar() {
    const mascotaCompleta = {
      ...this.mascota
    };

    const obs = this.editar ? this.apiService.actualizarMascota(mascotaCompleta) : this.apiService.agregarMascota(mascotaCompleta);

    obs.subscribe({
      next: async (response: any) => {
        if (response.success) {
          this.mostrarToast('Mascota guardada correctamente', 'success');
          this.modalCtrl.dismiss();
        } else {
          this.mostrarToast('Error al agregar mascota', 'danger');
        }
      },
      error: async (error: any) => {
        this.mostrarToast('Error al agregar mascota', 'danger');
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
}
