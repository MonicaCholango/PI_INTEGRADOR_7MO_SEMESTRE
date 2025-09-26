import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastController, NavController, IonicModule} from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {API_CONSTANTS} from "../../models/constants";

@Component({
  selector: 'app-recover-pass',
  imports: [
    IonicModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './recover-pass.page.html'
})
export class RecoverPassPage {
  step: number = 1;   // 1 = pedir email, 2 = reset pass
  email: string = '';
  code: string = '';
  password: string = '';
  password2: string = '';

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
  }

  async sendCode() {
    this.http.post(API_CONSTANTS.BASE_URL + 'send-reset-code.php', {email: this.email})
      .subscribe({
        next: async (res: any) => {
          if (res.success) {
            this.step = 2; // avanzar al siguiente bloque
            const toast = await this.toastCtrl.create({
              message: 'Código enviado al correo',
              duration: 2000,
              color: 'success'
            });
            toast.present();
          } else {
            const toast = await this.toastCtrl.create({message: res.message, duration: 2000, color: 'danger'});
            toast.present();
          }
        },
        error: async () => {
          const toast = await this.toastCtrl.create({message: 'Error en servidor', duration: 2000, color: 'danger'});
          toast.present();
        }
      });
  }

  async resetPassword() {
    if (this.password !== this.password2) {
      const toast = await this.toastCtrl.create({
        message: 'Las contraseñas no coinciden',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.http.post(API_CONSTANTS.BASE_URL + 'reset-password.php', {
      email: this.email,
      code: this.code,
      password: this.password
    }).subscribe({
      next: async (res: any) => {
        if (res.success) {
          const toast = await this.toastCtrl.create({
            message: 'Contraseña cambiada con éxito',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.navCtrl.navigateRoot(['/login']);
        } else {
          const toast = await this.toastCtrl.create({message: res.message, duration: 2000, color: 'danger'});
          toast.present();
        }
      }
    });
  }
}
