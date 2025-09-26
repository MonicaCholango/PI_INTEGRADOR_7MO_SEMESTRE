import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { UI_CONSTANTS } from '../models/constants';

export interface NotificationOptions {
  message: string;
  color?: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
  showCloseButton?: boolean;
  icon?: string;
}

export interface AlertOptions {
  header: string;
  message?: string;
  subHeader?: string;
  cssClass?: string;
  buttons?: any[];
  inputs?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private currentLoading: HTMLIonLoadingElement | null = null;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}


  async showSuccess(message: string, duration?: number): Promise<void> {
    await this.showToast({
      message,
      color: 'success',
      duration: duration || UI_CONSTANTS.TOAST_DURATION,
      icon: 'checkmark-circle'
    });
  }


  async showError(message: string, duration?: number): Promise<void> {
    await this.showToast({
      message,
      color: 'danger',
      duration: duration || UI_CONSTANTS.TOAST_DURATION,
      icon: 'close-circle'
    });
  }

  async showWarning(message: string, duration?: number): Promise<void> {
    await this.showToast({
      message,
      color: 'warning',
      duration: duration || UI_CONSTANTS.TOAST_DURATION,
      icon: 'warning'
    });
  }


  async showInfo(message: string, duration?: number): Promise<void> {
    await this.showToast({
      message,
      color: 'primary',
      duration: duration || UI_CONSTANTS.TOAST_DURATION,
      icon: 'information-circle'
    });
  }


  async showToast(options: NotificationOptions): Promise<void> {
    const toast = await this.toastController.create({
      message: options.message,
      color: options.color || 'primary',
      duration: options.duration || UI_CONSTANTS.TOAST_DURATION,
      position: options.position || 'top',
      buttons: options.showCloseButton ? [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ] : undefined,
      icon: options.icon
    });

    await toast.present();
  }

  async showLoading(message: string = 'Cargando...'): Promise<HTMLIonLoadingElement> {
    if (this.currentLoading) {
      await this.hideLoading();
    }

    this.currentLoading = await this.loadingController.create({
      message,
      spinner: 'crescent',
      duration: UI_CONSTANTS.LOADING_TIMEOUT,
      cssClass: 'loading-custom'
    });

    await this.currentLoading.present();
    return this.currentLoading;
  }


  async hideLoading(): Promise<void> {
    if (this.currentLoading) {
      await this.currentLoading.dismiss();
      this.currentLoading = null;
    }
  }


  async showConfirmAlert(
    title: string,
    message: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: title,
        message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: confirmText,
            handler: () => resolve(true)
          }
        ]
      });

      await alert.present();
    });
  }


  async showAlert(options: AlertOptions): Promise<void> {
    const alert = await this.alertController.create({
      header: options.header,
      subHeader: options.subHeader,
      message: options.message,
      cssClass: options.cssClass,
      buttons: options.buttons || ['OK'],
      inputs: options.inputs
    });

    await alert.present();
  }


  async showPrompt(
    title: string,
    message: string,
    placeholder: string = '',
    inputType: string = 'text'
  ): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: title,
        message,
        inputs: [
          {
            name: 'input',
            type: inputType as any,
            placeholder
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(null)
          },
          {
            text: 'Aceptar',
            handler: (data) => resolve(data.input || null)
          }
        ]
      });

      await alert.present();
    });
  }

  async showMultiInputAlert(
    title: string,
    inputs: any[],
    message?: string
  ): Promise<any | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: title,
        message,
        inputs,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(null)
          },
          {
            text: 'Aceptar',
            handler: (data) => resolve(data)
          }
        ]
      });

      await alert.present();
    });
  }

 
  async showDeleteConfirm(
    itemName: string,
    customMessage?: string
  ): Promise<boolean> {
    const message = customMessage || `¿Estás seguro de que quieres eliminar "${itemName}"? Esta acción no se puede deshacer.`;
    
    return this.showConfirmAlert(
      'Confirmar Eliminación',
      message,
      'Eliminar',
      'Cancelar'
    );
  }

  
  async showLogoutConfirm(): Promise<boolean> {
    return this.showConfirmAlert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      'Cerrar Sesión',
      'Cancelar'
    );
  }

  
  async showOfflineNotification(): Promise<void> {
    await this.showWarning(
      'Sin conexión a internet. Algunas funciones pueden no estar disponibles.',
      5000
    );
  }

  
  async showOnlineNotification(): Promise<void> {
    await this.showSuccess('Conexión restaurada', 2000);
  }

  
  async dismissAll(): Promise<void> {
    await this.hideLoading();
    
    const toast = await this.toastController.getTop();
    if (toast) {
      await toast.dismiss();
    }

    const alert = await this.alertController.getTop();
    if (alert) {
      await alert.dismiss();
    }
  }
}