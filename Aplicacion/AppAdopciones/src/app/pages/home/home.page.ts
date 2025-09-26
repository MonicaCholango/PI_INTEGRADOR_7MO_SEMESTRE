import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/interfaces';
import { APP_CONSTANTS } from '../../models/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class HomePage implements OnInit {
  usuario: Usuario | null = null;
  mostrarModalDonaciones = false;

  // URL de PayPal desde las constantes
  paypalUrl = APP_CONSTANTS.PAYPAL_URL;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  // Navegación
  irALogin() {
    this.router.navigate(['/login']);
  }

  irAMascotas() {
    this.router.navigate(['/mascotas']);
  }

  irAEventos() {
    this.router.navigate(['/eventos']);
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  irAAdmin() {
    this.router.navigate(['/admin']);
  }

  irADenuncias() {
    this.router.navigate(['/denuncias']);
  }

  // Modal de donaciones
  abrirModalDonaciones() {
    this.mostrarModalDonaciones = true;
  }

  cerrarModalDonaciones() {
    this.mostrarModalDonaciones = false;
  }

  // Abrir enlaces externos
  abrirEnlace(url: string) {
    window.open(url, '_blank');
  }

  // Cerrar sesión
  async cerrarSesion() {
    await this.authService.logout();
    this.usuario = null;
  }
}