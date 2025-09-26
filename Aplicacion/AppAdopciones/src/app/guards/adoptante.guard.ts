import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class AdoptanteGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const usuario = this.authService.getUsuarioSync();
    
    if (!usuario) {
      this.router.navigate(['/login']);
      return false;
    }

    if (usuario.tipoUsuario === TipoUsuario.ADOPTANTE) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}