import {Component, OnInit} from '@angular/core';
import {AlertController, IonicModule, ToastController, ModalController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PhotoPipe} from "../../pipes/photo.pipe";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-denuncias-admin',
  templateUrl: './denuncias-admin.page.html',
  styleUrls: ['./denuncias-admin.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule, 
    PhotoPipe
  ]
})
export class DenunciasAdminPage implements OnInit {

  denuncias: any[] = [];
  cargando = false;

  constructor(
    private alertCtrl: AlertController, 
    private apiService: ApiService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;

    try {
      await Promise.all([
        this.cargarDenuncias(),
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarToast('Error al cargar datos', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  cargarDenuncias(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerDenuncias().subscribe({
        next: (denuncias) => {
          this.denuncias = denuncias;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar denuncias:', error);
          resolve(); 
        }
      });
    });
  }

  async abrirDetallesDenuncia(denuncia: any) {
    const modal = await this.modalController.create({
      component: DenunciaDetalleModalComponent,
      componentProps: {
        denuncia: denuncia
      },
      cssClass: 'denuncia-modal',
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.8
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.action) {
        this.procesarAccionModal(denuncia, result.data.action, result.data.observaciones);
      }
    });

    return await modal.present();
  }

  async procesarAccionModal(denuncia: any, accion: 'aceptada' | 'denegada', observaciones?: string) {
    try {
      const mensajeExito = accion === 'aceptada' 
        ? 'Denuncia aceptada correctamente. Se iniciará la investigación correspondiente.'
        : 'Denuncia denegada. Se notificará al denunciante.';
      
      this.mostrarToast(mensajeExito, accion === 'aceptada' ? 'success' : 'warning');
      
      const index = this.denuncias.findIndex(d => d.id === denuncia.id);
      if (index > -1) {
        this.denuncias.splice(index, 1);
      }
      
      if (accion === 'aceptada') {
        this.enviarNotificacionDenunciante(denuncia, 'Su denuncia ha sido aceptada y se está procesando.');
      }

    } catch (error) {
      console.error('Error al procesar denuncia:', error);
      this.mostrarToast('Error al procesar la denuncia', 'danger');
    }
  }

  async enviarNotificacionDenunciante(denuncia: any, mensaje: string) {
    if (!denuncia.denunciante_email) {
      return;
    }

    try {
      console.log(`Enviando notificación a ${denuncia.denunciante_email}: ${mensaje}`);
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';

    try {
      const fechaObj = new Date(fecha);
      const ahora = new Date();
      const diferencia = ahora.getTime() - fechaObj.getTime();
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const dias = Math.floor(horas / 24);

      if (horas < 1) return 'Hace menos de 1 hora';
      if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
      if (dias < 7) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
      
      return fechaObj.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  async verFotoCompleta(fotoUrl: string) {
    const modal = await this.modalController.create({
      component: FotoModalComponent,
      componentProps: {
        fotoUrl: fotoUrl
      }
    });

    await modal.present();
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

  trackByDenunciaId(index: number, denuncia: any): number {
    return denuncia.id || index;
  }
}

// Modal Component para mostrar detalles de la denuncia
@Component({
  selector: 'app-denuncia-detalle-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Detalles de la Denuncia</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrarModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="modal-content">
      <div class="detail-sections">
        
        <!-- Información del denunciante -->
        <div class="detail-section">
          <div class="section-title">
            <ion-icon name="person" color="success"></ion-icon>
            <span>Información del Denunciante</span>
          </div>
          <div class="detail-item" *ngIf="denuncia.denunciante_nombre">
            <ion-icon name="person"></ion-icon>
            <span class="detail-label">Nombre:</span>
            <span class="detail-value">{{ denuncia.denunciante_nombre }}</span>
          </div>
          <div class="detail-item" *ngIf="denuncia.denunciante_email">
            <ion-icon name="mail"></ion-icon>
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ denuncia.denunciante_email }}</span>
          </div>
          <div class="detail-item" *ngIf="denuncia.denunciante_telefono">
            <ion-icon name="call"></ion-icon>
            <span class="detail-label">Teléfono:</span>
            <span class="detail-value">{{ denuncia.denunciante_telefono }}</span>
          </div>
        </div>

        <!-- Detalles del incidente -->
        <div class="detail-section">
          <div class="section-title">
            <ion-icon name="location" color="success"></ion-icon>
            <span>Detalles del Incidente</span>
          </div>
          <div class="detail-item" *ngIf="denuncia.ciudad">
            <ion-icon name="business"></ion-icon>
            <span class="detail-label">Ciudad:</span>
            <span class="detail-value">{{ denuncia.ciudad }}</span>
          </div>
          <div class="detail-item" *ngIf="denuncia.direccion">
            <ion-icon name="location"></ion-icon>
            <span class="detail-label">Dirección:</span>
            <span class="detail-value">{{ denuncia.direccion }}</span>
          </div>
          <div class="detail-item" *ngIf="denuncia.tipo_mascota">
            <ion-icon name="paw"></ion-icon>
            <span class="detail-label">Animal:</span>
            <span class="detail-value">{{ denuncia.tipo_mascota }}</span>
          </div>
          <div class="detail-item">
            <ion-icon name="calendar"></ion-icon>
            <span class="detail-label">Fecha:</span>
            <span class="detail-value">{{ formatearFecha(denuncia.fecha_reporte) }}</span>
          </div>
        </div>

        <!-- Descripción del incidente -->
        <div class="detail-section" *ngIf="denuncia.observaciones">
          <div class="section-title">
            <ion-icon name="document-text" color="success"></ion-icon>
            <span>Descripción del Incidente</span>
          </div>
          <p class="description-text">{{ denuncia.observaciones }}</p>
        </div>
      </div>

      <!-- Evidencia fotográfica -->
      <div class="evidence-section" *ngIf="denuncia.foto">
        <img [src]="denuncia.foto | photo" 
             alt="Evidencia de denuncia"
             (click)="verFotoCompleta(denuncia.foto)"
             class="evidence-image">
        <p class="foto-note">
          <ion-icon name="eye" color="success"></ion-icon>
          Toca la imagen para verla en tamaño completo
        </p>
      </div>

      <!-- Acciones -->
      <div class="modal-actions">
        <ion-button 
          expand="block" 
          color="success" 
          (click)="procesarDenuncia('aceptada')">
          <ion-icon name="checkmark-circle" slot="start"></ion-icon>
          Aceptar Denuncia
        </ion-button>
        <ion-button 
          expand="block" 
          color="danger" 
          fill="outline"
          (click)="procesarDenuncia('denegada')">
          <ion-icon name="close-circle" slot="start"></ion-icon>
          Denegar Denuncia
        </ion-button>
      </div>

    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, PhotoPipe]
})
export class DenunciaDetalleModalComponent {
  denuncia: any = {};

  constructor(
    private modalController: ModalController,
    private alertCtrl: AlertController
  ) {}

  async cerrarModal() {
    await this.modalController.dismiss();
  }

  async procesarDenuncia(accion: 'aceptada' | 'denegada') {
    const tituloAccion = accion === 'aceptada' ? 'Aceptar' : 'Denegar';
    const mensajeAccion = accion === 'aceptada' ? 'aceptar' : 'denegar';

    const alert = await this.alertCtrl.create({
      header: `${tituloAccion} Denuncia`,
      message: `¿Estás seguro de que quieres ${mensajeAccion} esta denuncia?`,
      inputs: [
        {
          name: 'observaciones',
          type: 'textarea',
          placeholder: `Motivo para ${mensajeAccion} la denuncia (opcional)`,
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: tituloAccion,
          handler: (data) => {
            this.confirmarAccion(accion, data.observaciones);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarAccion(accion: 'aceptada' | 'denegada', observaciones?: string) {
    await this.modalController.dismiss({
      action: accion,
      observaciones: observaciones
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';

    try {
      const fechaObj = new Date(fecha);
      const ahora = new Date();
      const diferencia = ahora.getTime() - fechaObj.getTime();
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const dias = Math.floor(horas / 24);

      if (horas < 1) return 'Hace menos de 1 hora';
      if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
      if (dias < 7) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
      
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

  async verFotoCompleta(fotoUrl: string) {
    const modal = await this.modalController.create({
      component: FotoModalComponent,
      componentProps: {
        fotoUrl: fotoUrl
      }
    });

    await modal.present();
  }
}

// Modal Component para mostrar foto completa (ya existente, mantenido)
@Component({
  selector: 'app-foto-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Evidencia Fotográfica</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrarModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <div class="foto-completa">
        <img [src]="fotoUrl | photo" alt="Evidencia de denuncia">
      </div>
    </ion-content>
  `,
  styles: [`
    .foto-completa {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: var(--border-radius-medium);
        box-shadow: var(--shadow-strong);
      }
    }
  `],
  standalone: true,
  imports: [IonicModule, PhotoPipe]
})
export class FotoModalComponent {
  fotoUrl: string = '';

  constructor(private modalController: ModalController) {}

  async cerrarModal() {
    await this.modalController.dismiss();
  }
}