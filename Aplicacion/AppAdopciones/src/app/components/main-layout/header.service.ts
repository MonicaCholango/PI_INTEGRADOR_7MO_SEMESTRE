import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HeaderService {
  // Título dinámico del header
  private tituloSubject = new BehaviorSubject<string>('PAE Adopciones');
  titulo$ = this.tituloSubject.asObservable();

  // Vista actual (puede ser una string tipo "home", "admin", etc.)
  private vistaSubject = new BehaviorSubject<string>('dashboard');
  vistaActual$ = this.vistaSubject.asObservable();

  private data = new BehaviorSubject<{usuarios: [],
    mascotas: [],
    solicitudes: [],
    tiposMascota: [],
    centros:[],
    ciudades:[]}>({
    usuarios: [],
    mascotas: [],
    solicitudes: [],
    tiposMascota: [],
    centros:[],
    ciudades:[]
  });
  data$ = this.data.asObservable();

  // Métodos para actualizar
  setTitulo(nuevoTitulo: string) {
    this.tituloSubject.next(nuevoTitulo);
  }

  setVistaActual(nuevaVista: string) {
    this.vistaSubject.next(nuevaVista);
  }

  setData(nuevaVista: any) {
    this.data.next(nuevaVista);
  }

  // Por si necesitas valores sin suscribirte
  get titulo(): string {
    return this.tituloSubject.getValue();
  }

  get vistaActual(): string {
    return this.vistaSubject.getValue();
  }
}
