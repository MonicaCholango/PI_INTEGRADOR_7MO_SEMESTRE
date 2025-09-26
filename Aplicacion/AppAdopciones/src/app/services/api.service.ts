import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError, BehaviorSubject, timer} from 'rxjs';
import {catchError, retry, timeout, map, finalize} from 'rxjs/operators';
import {
  Usuario,
  Mascota,
  Solicitud,
  Centro,
  Ciudad,
  TipoMascota,
  Estado,
  EstadoAdopcion,
  Salud,
  ApiResponse,
  LoginResponse,
  Denuncias,
  Evento  // Agregado para resolver el error
} from '../models/interfaces';
import {API_CONSTANTS, UI_CONSTANTS} from '../models/constants';
import {NotificationService} from './notification.service';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = API_CONSTANTS.BASE_URL;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestQueue: Map<string, Observable<any>> = new Map();

  public loading$ = this.loadingSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private storageService: StorageService
  ) {
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    timer(0, 5 * 60 * 1000).subscribe(() => {
      this.requestQueue.clear();
    });
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private handleError = (operation = 'operation') => {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} failed:`, error);

      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Datos inválidos enviados al servidor';
            break;
          case 401:
            errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 422:
            errorMessage = error.error?.message || 'Datos de validación incorrectos';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Intenta más tarde.';
            break;
          case 503:
            errorMessage = 'Servicio no disponible temporalmente';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      if (error.status !== 401) {
        this.notificationService.showError(errorMessage);
      }

      return throwError(() => ({
        error: true,
        message: errorMessage,
        status: error.status,
        originalError: error
      }));
    };
  };

  private makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    useCache: boolean = false,
    customOptions?: any
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${method}:${url}:${JSON.stringify(data)}`;

    if (useCache && this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)!;
    }

    this.setLoading(true);

    let request: Observable<any>;
    const options = {...this.httpOptions, ...customOptions};

    switch (method.toUpperCase()) {
      case 'GET':
        const params = this.buildHttpParams(data);
        request = this.http.get(url, {...options, params});
        break;
      case 'POST':
        request = this.http.post(url, data, options);
        break;
      case 'PUT':
        request = this.http.put(url, data, options);
        break;
      case 'DELETE':
        request = this.http.delete(url, options);
        break;
      default:
        return throwError(() => new Error(`Método HTTP no soportado: ${method}`));
    }

    const finalRequest = request.pipe(
      timeout(UI_CONSTANTS.LOADING_TIMEOUT),
      retry(2),
      map((response: any): T => {
        if (response && typeof response === 'object' && response.success !== undefined) {
          return response as T;
        }
        return {success: true, data: response} as T;
      }),
      catchError(this.handleError(`${method} ${endpoint}`)),
      finalize(() => {
        this.setLoading(false);
        if (useCache && this.requestQueue.has(cacheKey)) {
          this.requestQueue.delete(cacheKey);
        }
      })
    );

    if (useCache) {
      this.requestQueue.set(cacheKey, finalRequest);
    }

    return finalRequest;
  }

  private buildHttpParams(data: any): HttpParams {
    let params = new HttpParams();

    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          params = params.set(key, data[key].toString());
        }
      });
    }

    return params;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.makeRequest<LoginResponse>('POST', API_CONSTANTS.ENDPOINTS.LOGIN, {
      email,
      password
    });
  }

  registrarUsuario(usuario: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('POST', API_CONSTANTS.ENDPOINTS.REGISTER, usuario);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.makeRequest<ApiResponse<Usuario[]>>('GET', API_CONSTANTS.ENDPOINTS.USUARIOS, null, true)
      .pipe(map(response => response.data || response as any));
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ACTUALIZAR_USUARIO}&id=${id}`, usuario);
  }

  cambiarEstadoUsuario(id: number, estado: string, tipoUsuario: string): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ESTADO_USUARIO}&id=${id}&tipoUsuario=${tipoUsuario}`, {estado});
  }

  eliminarUsuario(id: number, tipoUsuario: string): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('DELETE', `${API_CONSTANTS.ENDPOINTS.USUARIOS}&id=${id}&tipoUsuario=${tipoUsuario}`);
  }

  obtenerMascotas(): Observable<Mascota[]> {
    return this.makeRequest<ApiResponse<Mascota[]>>('GET', API_CONSTANTS.ENDPOINTS.MASCOTAS, null, true)
      .pipe(map(response => response.data || response as any));
  }

  obtenerMascotasDisponibles(): Observable<Mascota[]> {
    return this.makeRequest<ApiResponse<Mascota[]>>('GET', API_CONSTANTS.ENDPOINTS.MASCOTAS_DISPONIBLES, null, true)
      .pipe(map(response => response.data || response as any));
  }

  obtenerMascota(id: number): Observable<Mascota> {
    return this.makeRequest<ApiResponse<Mascota>>('GET', `${API_CONSTANTS.ENDPOINTS.MASCOTAS}?id=${id}`)
      .pipe(map(response => response.data || response as any));
  }

  agregarMascota(mascota: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('POST', API_CONSTANTS.ENDPOINTS.AGREGAR_MASCOTA, mascota);
  }

  actualizarMascota(mascota: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ACTUALIZAR_MASCOTA}&id=${mascota.id}`, mascota);
  }

  eliminarMascota(id: number): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('DELETE', `${API_CONSTANTS.ENDPOINTS.ELIMINAR_MASCOTA}&id=${id}`);
  }

  obtenerEventos(): Observable<Evento[]> {
    return this.makeRequest<ApiResponse<Evento[]>>('GET', API_CONSTANTS.ENDPOINTS.EVENTOS, null, true)
      .pipe(map(response => response.data || response as any));
  }

  obtenerEventosVigentes(): Observable<Evento[]> {
    return this.makeRequest<ApiResponse<Evento[]>>('GET', API_CONSTANTS.ENDPOINTS.EVENTOS_VIGENTES, null, true)
      .pipe(map(response => response.data || response as any));
  }

  agregarEvento(evento: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('POST', API_CONSTANTS.ENDPOINTS.AGREGAR_EVENTO, evento);
  }

  actualizarEvento(evento: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ACTUALIZAR_EVENTO}&id=${evento.id}`, evento);
  }

  eliminarEvento(id: number): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('DELETE', `${API_CONSTANTS.ENDPOINTS.ELIMINAR_EVENTO}&id=${id}`);
  }

  subirFotoEvento(eventoId: number, foto: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('foto', foto);
    
    return this.http.post<ApiResponse>(
      `${this.baseUrl}${API_CONSTANTS.ENDPOINTS.SUBIR_FOTO_EVENTO}&id=${eventoId}`,
      formData
    ).pipe(
      catchError(this.handleError('subir foto evento'))
    );
  }

  guardarFotoEvento(eventoId: number, fotoBase64: string, extension: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('foto', fotoBase64);
    formData.append('id_evento', eventoId.toString());
    formData.append('extension', extension);

    return this.http.post<ApiResponse>(
      `${this.baseUrl}adopciones.php?action=save_foto_evento`,
      formData
    ).pipe(
      catchError(this.handleError('guardar foto evento'))
    );
  }

  obtenerSolicitudes(): Observable<Solicitud[]> {
    return this.makeRequest<ApiResponse<Solicitud[]>>('GET', API_CONSTANTS.ENDPOINTS.SOLICITUDES, null, true)
      .pipe(map(response => response.data || response as any));
  }

  obtenerSolicitudesUsuario(usuarioId: number): Observable<Solicitud[]> {
    return this.makeRequest<ApiResponse<Solicitud[]>>('GET', `${API_CONSTANTS.ENDPOINTS.SOLICITUDES_USUARIO}&usuario_id=${usuarioId}`)
      .pipe(map(response => response.data || response as any));
  }

  crearSolicitud(solicitud: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('POST', API_CONSTANTS.ENDPOINTS.CREAR_SOLICITUD, solicitud);
  }

  actualizarSolicitud(id: number, estado: string, observaciones?: string): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ACTUALIZAR_SOLICITUD}&id=${id}`, {
      estado,
      observaciones
    });
  }

  obtenerCentros(): Observable<Centro[]> {
    return this.makeRequest<ApiResponse<Centro[]>>('GET', API_CONSTANTS.ENDPOINTS.CENTROS, null, true)
      .pipe(map(response => response.data || response as any));
  }

  agregarCentro(centro: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('POST', API_CONSTANTS.ENDPOINTS.AGREGAR_CENTRO, centro);
  }

  actualizarCentro(id: number, centro: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ACTUALIZAR_CENTRO}&id=${id}`, centro);
  }

  cambiarEstadoCentro(id: number, estado: boolean): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ESTADO_CENTRO}&id=${id}`, {activo: estado});
  }

  eliminarCentro(id: number): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('DELETE', `${API_CONSTANTS.ENDPOINTS.ELIMINAR_CENTRO}&id=${id}`);
  }

  obtenerCiudades(): Observable<Ciudad[]> {
    return this.makeRequest<ApiResponse<Ciudad[]>>('GET', API_CONSTANTS.ENDPOINTS.CIUDADES, null, true)
      .pipe(map(response => response.data || response as any));
  }

  agregarCiudad(ciudad: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('POST', API_CONSTANTS.ENDPOINTS.AGREGAR_CIUDAD, ciudad);
  }

  actualizarCiudad(id: number, ciudad: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ACTUALIZAR_CIUDAD}&id=${id}`, ciudad);
  }

  cambiarEstadoCiudad(id: number, estado: boolean): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ESTADO_CIUDAD}&id=${id}`, {activa: estado});
  }

  eliminarCiudad(id: number): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('DELETE', `${API_CONSTANTS.ENDPOINTS.ELIMINAR_CIUDAD}&id=${id}`);
  }

  obtenerTiposMascota(): Observable<TipoMascota[]> {
    return this.makeRequest<ApiResponse<TipoMascota[]>>('GET', API_CONSTANTS.ENDPOINTS.TIPOS_MASCOTA, null, true)
      .pipe(map(response => response.data || response as any));
  }

  agregarTipoMascota(tipo: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('POST', API_CONSTANTS.ENDPOINTS.AGREGAR_TIPO, tipo);
  }

  actualizarTipoMascota(id: number, tipo: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ACTUALIZAR_TIPO}&id=${id}`, tipo);
  }

  cambiarEstadoTipoMascota(id: number, estado: boolean): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('PUT', `${API_CONSTANTS.ENDPOINTS.ESTADO_TIPO}&id=${id}`, {activo: estado});
  }

  eliminarTipoMascota(id: number): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('DELETE', `${API_CONSTANTS.ENDPOINTS.ELIMINAR_TIPO}&id=${id}`);
  }

  obtenerEstados(): Observable<Estado[]> {
    return this.makeRequest<ApiResponse<Estado[]>>('GET', API_CONSTANTS.ENDPOINTS.ESTADOS, null, true)
      .pipe(map(response => response.data || response as any));
  }

  obtenerEstadosAdopcion(): Observable<EstadoAdopcion[]> {
    return this.makeRequest<ApiResponse<EstadoAdopcion[]>>('GET', API_CONSTANTS.ENDPOINTS.ESTADOS_ADOPCION, null, true)
      .pipe(map(response => response.data || response as any));
  }

  obtenerEstadosSalud(): Observable<Salud[]> {
    return this.makeRequest<ApiResponse<Salud[]>>('GET', API_CONSTANTS.ENDPOINTS.ESTADOS_SALUD, null, true)
      .pipe(map(response => response.data || response as any));
  }

  obtenerEmpleados(): Observable<Usuario[]> {
    return this.makeRequest<ApiResponse<Usuario[]>>('GET', API_CONSTANTS.ENDPOINTS.EMPLEADOS, null, true)
      .pipe(map(response => response.data || response as any));
  }

  editarCentro(id: number, centro: any): Observable<ApiResponse> {
    return this.actualizarCentro(id, centro);
  }

  editarCiudad(id: number, ciudad: any): Observable<ApiResponse> {
    return this.actualizarCiudad(id, ciudad);
  }

  editarTipoMascota(id: number, tipo: any): Observable<ApiResponse> {
    return this.actualizarTipoMascota(id, tipo);
  }

  obtenerEstadisticas(): Observable<any> {
    return this.makeRequest<ApiResponse>('GET', API_CONSTANTS.ENDPOINTS.ESTADISTICAS, null, true)
      .pipe(map(response => response.data || response));
  }

  obtenerReporte(tipo: string, fechaInicio?: string, fechaFin?: string): Observable<any> {
    const params = {tipo, fecha_inicio: fechaInicio, fecha_fin: fechaFin};
    return this.makeRequest<ApiResponse>('GET', 'adopciones.php?action=reporte', params);
  }

  buscarMascotas(filtros: any): Observable<Mascota[]> {
    return this.makeRequest<ApiResponse<Mascota[]>>('GET', 'adopciones.php?action=buscar_mascotas', filtros)
      .pipe(map(response => response.data || response as any));
  }

  buscarUsuarios(filtros: any): Observable<Usuario[]> {
    return this.makeRequest<ApiResponse<Usuario[]>>('GET', 'adopciones.php?action=buscar_usuarios', filtros)
      .pipe(map(response => response.data || response as any));
  }

  verificarConexion(): Observable<boolean> {
    return this.makeRequest<any>('GET', API_CONSTANTS.ENDPOINTS.PING)
      .pipe(
        map(() => true),
        catchError(() => {
          return throwError(() => false);
        })
      );
  }

  obtenerVersionApi(): Observable<string> {
    return this.makeRequest<ApiResponse>('GET', API_CONSTANTS.ENDPOINTS.VERSION)
      .pipe(map(response => response.data?.version || '1.0.0'));
  }

  limpiarCache(): void {
    this.requestQueue.clear();
  }

  invalidarCache(endpoint: string): void {
    const keysToDelete = Array.from(this.requestQueue.keys()).filter(key =>
      key.includes(endpoint)
    );
    keysToDelete.forEach(key => this.requestQueue.delete(key));
  }

  validarArchivo(archivo: File): { valido: boolean; error?: string } {
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB

    if (!tiposPermitidos.includes(archivo.type)) {
      return {
        valido: false,
        error: 'Tipo de archivo no permitido. Use JPG, PNG o GIF.'
      };
    }

    if (archivo.size > tamañoMaximo) {
      return {
        valido: false,
        error: 'El archivo es demasiado grande. Máximo 5MB.'
      };
    }

    return {valido: true};
  }

  async guardarEnOffline(endpoint: string, data: any): Promise<void> {
    try {
      await this.storageService.setOfflineData(endpoint, {
        data,
        timestamp: Date.now(),
        method: 'POST'
      });
    } catch (error) {
      console.error('Error guardando en offline:', error);
    }
  }

  async sincronizarOffline(): Promise<void> {
    console.log('Sincronizando datos offline...');
  }

  obtenerDenuncias(): Observable<Denuncias[]> {
    return this.makeRequest<ApiResponse<Denuncias[]>>('GET', API_CONSTANTS.ENDPOINTS.DENUNCIAS, null, true)
      .pipe(map(response => response.data || response as any));
  }

  guardarEmpleado(empleado: any): Observable<ApiResponse> {
    return this.makeRequest<ApiResponse>('POST', `adopciones.php?action=save_empleado`, empleado);
  }
}