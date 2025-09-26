import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Usuario, UserPreferences } from '../models/interfaces';
import { TipoUsuario, EstadoUsuario } from '../models/enums';
import { STORAGE_KEYS } from '../models/constants';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private sessionTimeout: any;
  private readonly sessionDuration = 24 * 60 * 60 * 1000; 

  public usuario$ = this.usuarioActual.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      await new Promise<void>((resolve) => {
        this.storageService.isReady$.subscribe((isReady) => {
          if (isReady) {
            resolve();
          }
        });
      });

      await this.verificarSesion();
      
      this.setupSessionCleanup();
      
    } catch (error) {
      console.error('Error inicializando AuthService:', error);
    }
  }

  async verificarSesion(): Promise<void> {
    try {
      const usuario = await this.storageService.getUser();
      const lastLogin = await this.storageService.get('last_login');
      
      if (usuario && this.isSessionValid(lastLogin)) {
        this.setUsuarioActual(usuario);
        this.startSessionTimeout();
        
        await this.updateLastActivity();
        
        console.log('Sesión válida restaurada para:', usuario.nombres);
      } else {
        await this.clearUserData();
        console.log('No hay sesión válida o la sesión ha expirado');
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      await this.clearUserData();
    }
  }

  async login(usuario: Usuario): Promise<boolean> {
    try {
      if (!this.validateUserData(usuario)) {
        throw new Error('Datos de usuario inválidos');
      }

      await this.storageService.setUser(usuario);
      await this.storageService.set('last_login', Date.now());
      await this.storageService.set('login_count', (await this.getLoginCount()) + 1);
      
      this.setUsuarioActual(usuario);
      
      this.startSessionTimeout();
      
      await this.loadUserPreferences(usuario.id!);
      
      console.log('Login exitoso para:', usuario.nombres);
      return true;
      
    } catch (error) {
      console.error('Error en login:', error);
      await this.notificationService.showError('Error al iniciar sesión');
      return false;
    }
  }

  async logout(showNotification: boolean = true): Promise<boolean> {
    try {
      const usuario = this.usuarioActual.value;
      
      if (usuario) {
        await this.saveSessionStats();
      }
      
      this.clearSessionTimeout();
      
      await this.clearUserData();
      
      this.usuarioActual.next(null);
      this.isAuthenticatedSubject.next(false);
      
      if (showNotification) {
        await this.notificationService.showSuccess('Sesión cerrada correctamente');
      }
      
      console.log('Logout exitoso');
      return true;
      
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  }

  async renewSession(): Promise<boolean> {
    try {
      const usuario = this.usuarioActual.value;
      if (!usuario) {
        return false;
      }

      await this.storageService.set('last_login', Date.now());
      await this.updateLastActivity();
      
      this.startSessionTimeout();
      
      console.log('Sesión renovada para:', usuario.nombres);
      return true;
      
    } catch (error) {
      console.error('Error renovando sesión:', error);
      return false;
    }
  }

  getUsuarioSync(): Usuario | null {
    return this.usuarioActual.value;
  }

  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuario$;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isAdmin(): boolean {
    const usuario = this.usuarioActual.value;
    return usuario?.tipoUsuario === TipoUsuario.ADMIN;
  }

  isAdoptante(): boolean {
    const usuario = this.usuarioActual.value;
    return usuario?.tipoUsuario === TipoUsuario.ADOPTANTE;
  }

  isActive(): boolean {
    const usuario = this.usuarioActual.value;
    return usuario?.estado === EstadoUsuario.ACTIVO;
  }

  isBlocked(): boolean {
    const usuario = this.usuarioActual.value;
    return usuario?.bloqueado === true || usuario?.estado === EstadoUsuario.BLOQUEADO;
  }

  puedeAccederAPerfil(): boolean {
    return this.isAuthenticated() && this.isActive();
  }

  puedeAccederASolicitudes(): boolean {
    return this.isAuthenticated() && this.isAdoptante() && this.isActive();
  }

  puedeAccederAAdmin(): boolean {
    return this.isAuthenticated() && this.isAdmin() && this.isActive();
  }

  puedeSolicitarAdopcion(): boolean {
    return this.isAuthenticated() && this.isAdoptante() && this.isActive() && !this.isBlocked();
  }

  puedeGestionarUsuarios(): boolean {
    return this.isAdmin() && this.isActive();
  }

  puedeGestionarMascotas(): boolean {
    return this.isAdmin() && this.isActive();
  }

  async actualizarUsuario(usuario: Usuario): Promise<boolean> {
    try {
      if (!this.validateUserData(usuario)) {
        throw new Error('Datos de usuario inválidos');
      }

      await this.storageService.setUser(usuario);
      this.setUsuarioActual(usuario);
      
      console.log('Usuario actualizado en sesión:', usuario.nombres);
      return true;
      
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  }

  async updateLastActivity(): Promise<void> {
    try {
      await this.storageService.set('last_activity', Date.now());
    } catch (error) {
      console.error('Error actualizando última actividad:', error);
    }
  }

  async loadUserPreferences(userId: number): Promise<UserPreferences | null> {
    try {
      const prefs = await this.storageService.get(`user_preferences_${userId}`);
      if (prefs) {
        return prefs as UserPreferences;
      }
      
      const defaultPrefs: UserPreferences = {
        theme: 'auto',
        language: 'es',
        notifications: {
          enabled: true,
          email: true,
          push: true,
          sms: false,
          frequency: 'Inmediata'
        },
        privacy: {
          showEmail: false,
          showPhone: false,
          allowContact: true
        }
      };
      
      await this.saveUserPreferences(userId, defaultPrefs);
      return defaultPrefs;
      
    } catch (error) {
      console.error('Error cargando preferencias:', error);
      return null;
    }
  }

  async saveUserPreferences(userId: number, preferences: UserPreferences): Promise<boolean> {
    try {
      await this.storageService.set(`user_preferences_${userId}`, preferences);
      return true;
    } catch (error) {
      console.error('Error guardando preferencias:', error);
      return false;
    }
  }

  async getLoginCount(): Promise<number> {
    try {
      return (await this.storageService.get('login_count')) || 0;
    } catch (error) {
      return 0;
    }
  }

  async getSessionStats(): Promise<any> {
    try {
      const lastLogin = await this.storageService.get('last_login');
      const lastActivity = await this.storageService.get('last_activity');
      const loginCount = await this.getLoginCount();
      
      return {
        lastLogin: lastLogin ? new Date(lastLogin) : null,
        lastActivity: lastActivity ? new Date(lastActivity) : null,
        loginCount,
        sessionDuration: lastLogin ? Date.now() - lastLogin : 0,
        isActive: this.isAuthenticated()
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }

  async saveSessionStats(): Promise<void> {
    try {
      const stats = await this.getSessionStats();
      if (stats) {
        await this.storageService.set('session_history', {
          ...stats,
          logoutTime: Date.now()
        });
      }
    } catch (error) {
      console.error('Error guardando estadísticas:', error);
    }
  }

  private setUsuarioActual(usuario: Usuario): void {
    this.usuarioActual.next(usuario);
    this.isAuthenticatedSubject.next(true);
  }

  private validateUserData(usuario: Usuario): boolean {
    return !!(
      usuario &&
      usuario.id &&
      usuario.nombres &&
      usuario.apellidos &&
      usuario.correo &&
      usuario.tipoUsuario &&
      Object.values(TipoUsuario).includes(usuario.tipoUsuario)
    );
  }

  private isSessionValid(lastLogin: number): boolean {
    if (!lastLogin) return false;
    
    const sessionAge = Date.now() - lastLogin;
    return sessionAge < this.sessionDuration;
  }

  private startSessionTimeout(): void {
    this.clearSessionTimeout();
    
    this.sessionTimeout = setTimeout(async () => {
      await this.notificationService.showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      await this.logout(false);
    }, this.sessionDuration);
  }

  private clearSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  private async clearUserData(): Promise<void> {
    try {
      await this.storageService.removeUser();
      await this.storageService.remove('last_login');
      await this.storageService.remove('last_activity');
    } catch (error) {
      console.error('Error limpiando datos de usuario:', error);
    }
  }

  private setupSessionCleanup(): void {
    timer(0, 60 * 60 * 1000).subscribe(async () => {
      const lastLogin = await this.storageService.get('last_login');
      if (lastLogin && !this.isSessionValid(lastLogin)) {
        await this.logout(false);
      }
    });
  }

  async recordFailedAttempt(email: string): Promise<void> {
    try {
      const attempts = await this.storageService.get('failed_attempts') || {};
      const userAttempts = attempts[email] || { count: 0, lastAttempt: 0 };
      
      userAttempts.count++;
      userAttempts.lastAttempt = Date.now();
      
      attempts[email] = userAttempts;
      await this.storageService.set('failed_attempts', attempts);
      
      if (userAttempts.count >= 3) {
        await this.notificationService.showWarning(
          `Demasiados intentos fallidos. Espera antes de intentar nuevamente.`
        );
      }
    } catch (error) {
      console.error('Error registrando intento fallido:', error);
    }
  }

  async isTemporarilyBlocked(email: string): Promise<boolean> {
    try {
      const attempts = await this.storageService.get('failed_attempts') || {};
      const userAttempts = attempts[email];
      
      if (!userAttempts) return false;
      
      const timeSinceLastAttempt = Date.now() - userAttempts.lastAttempt;
      const blockTime = 15 * 60 * 1000; // 15 minutos
      
      return userAttempts.count >= 5 && timeSinceLastAttempt < blockTime;
    } catch (error) {
      console.error('Error verificando bloqueo temporal:', error);
      return false;
    }
  }

  async clearFailedAttempts(email: string): Promise<void> {
    try {
      const attempts = await this.storageService.get('failed_attempts') || {};
      delete attempts[email];
      await this.storageService.set('failed_attempts', attempts);
    } catch (error) {
      console.error('Error limpiando intentos fallidos:', error);
    }
  }

  getDebugInfo(): any {
    return {
      isAuthenticated: this.isAuthenticated(),
      usuario: this.usuarioActual.value,
      sessionTimeoutActive: !!this.sessionTimeout,
      timestamp: new Date().toISOString()
    };
  }


  async forceSessionExpiration(): Promise<void> {
    if (this.sessionTimeout) {
      this.clearSessionTimeout();
      await this.logout();
    }
  }
}