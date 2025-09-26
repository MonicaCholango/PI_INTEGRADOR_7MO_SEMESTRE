import {
  TipoUsuario,
  EstadoUsuario,
  EstadoSolicitud,
  EstadoMascota,
  EstadoAdopcion,
  TipoMascotaEnum,
  EstadoSalud
} from './enums';

export interface Usuario {
  id?: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  celular: string;
  correo: string;
  password?: string;
  fecha_nacimiento?: string;
  ciudad_id: number;
  ciudad?: string;
  area?: string;
  centro_id?: number;
  tipoUsuario: TipoUsuario;
  estado: EstadoUsuario;
  intentos_fallidos?: number;
  bloqueado?: boolean;
  fecha_registro?: string;
  ultima_conexion?: string;
}

export interface PerfilUsuario extends Omit<Usuario, 'password'> {
  estadisticas?: {
    solicitudesEnviadas?: number;
    adopcionesAprobadas?: number;
    tiempoEnPlataforma?: string;
  };
}

export interface Mascota {
  id?: number;
  nombre: string;
  edad: string;
  fecha_registro: string;
  fecha_ingreso: string;
  fecha_salida?: string;
  estado_adopcion_id: number;
  centro_id: number;
  ciudad_id: number;
  estado_id: number;
  salud2_id: number;
  responsable_id: number;
  tipo_mascota_id: number;
  observaciones: string;
  foto?: string;

  estadoAdopcion?: string;
  centro?: string;
  ciudad?: string;
  estado?: string;
  salud?: string;
  responsable?: string;
  tipoMascota?: string;

  peso?: number;
  altura?: number;
  color?: string;
  genero?: 'Macho' | 'Hembra';
  personalidad?: string[];
  necesidades_especiales?: string;
  vacunas_al_dia?: boolean;
  historia?: string;
}

export interface MascotaDetalle extends Mascota {
  solicitudesActivas?: number;
  historialMedico?: HistorialMedico[];
  fotos?: FotoMascota[];
}

export interface FotoMascota {
  id?: number;
  mascota_id: number;
  url: string;
  descripcion?: string;
  es_principal: boolean;
  fecha_subida: string;
}

export interface HistorialMedico {
  id?: number;
  mascota_id: number;
  fecha: string;
  tipo: 'Vacuna' | 'Tratamiento' | 'Cirugia' | 'Revision' | 'Emergencia';
  descripcion: string;
  veterinario?: string;
  costo?: number;
  centro_id?: number;
}

export interface Solicitud {
  id?: number;
  mascota_id: number;
  usuario_id: number;
  usuario_tipo: 'adoptante' | 'empleado';
  estado: EstadoSolicitud;
  fecha_solicitud: string;
  fecha_actualizacion?: string;
  observaciones?: string;
  motivo_rechazo?: string;

  mascota?: Mascota;
  mascota_nombre?: string;
  tipoMascota?: string;
  edad?: string;
  foto?: string;
  centro?: string;
  ciudad?: string;

  usuario?: Usuario;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  celular?: string;

  revisado_por?: number;
  fecha_revision?: string;
  documentos_entregados?: boolean;
  visita_realizada?: boolean;
  seguimiento_post_adopcion?: SeguimientoAdopcion[];
}

export interface SolicitudDetalle extends Solicitud {
  documentos?: DocumentoSolicitud[];
  entrevista?: EntrevistaSolicitud;
  evaluacion?: EvaluacionSolicitud;
}

export interface DocumentoSolicitud {
  id?: number;
  solicitud_id: number;
  tipo: 'Cedula' | 'ComprobanteIngresos' | 'ComprobanteDomicilio' | 'Otro';
  nombre_archivo: string;
  url: string;
  fecha_subida: string;
  verificado: boolean;
}

export interface EntrevistaSolicitud {
  id?: number;
  solicitud_id: number;
  fecha_programada: string;
  fecha_realizada?: string;
  entrevistador_id?: number;
  modalidad: 'Presencial' | 'Virtual' | 'Telefonica';
  observaciones?: string;
  puntuacion?: number;
  aprobada: boolean;
}

export interface EvaluacionSolicitud {
  id?: number;
  solicitud_id: number;
  evaluador_id: number;
  fecha_evaluacion: string;
  criterios: {
    experiencia_mascotas: number;
    estabilidad_economica: number;
    tiempo_disponible: number;
    espacio_adecuado: number;
    compromiso_largo_plazo: number;
  };
  puntuacion_total: number;
  comentarios: string;
  recomendacion: 'Aprobar' | 'Rechazar' | 'Revisar';
}

export interface SeguimientoAdopcion {
  id?: number;
  solicitud_id: number;
  fecha: string;
  tipo: 'Llamada' | 'Visita' | 'Video' | 'Fotos';
  estado_mascota: 'Excelente' | 'Bueno' | 'Regular' | 'Preocupante';
  observaciones: string;
  responsable_id: number;
  proxima_revision?: string;
}

export interface Centro {
  id?: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  ciudad_id?: number;
  ciudad?: string;
  activo?: boolean;
  fecha_registro?: string;
  capacidad_maxima?: number;
  servicios?: string[];
}

export interface Ciudad {
  id?: number;
  nombre: string;
  provincia?: string;
  codigo_postal?: string;
  activa?: boolean;
}

export interface TipoMascota {
  id?: number;
  nombre: TipoMascotaEnum;
  descripcion?: string;
  cuidados_especiales?: string;
  activo?: boolean;
}

export interface Estado {
  id?: number;
  nombre: EstadoMascota;
  descripcion?: string;
  color?: string;
  activo?: boolean;
}

export interface EstadoAdopcionInterface {
  id?: number;
  nombre: EstadoAdopcion;
  descripcion?: string;
  color?: string;
  activo?: boolean;
}

export interface Salud {
  id?: number;
  estado: EstadoSalud;
  descripcion?: string;
  activo?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: { [key: string]: string[] };
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  };
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: { usuario?: Usuario };
  token?: string;
  expires_in?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AppConfig {
  apiUrl: string;
  apiTimeout: number;
  maxFileSize: number;
  allowedImageTypes: string[];
  itemsPerPage: number;
  cacheTimeout: number;
}

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'Inmediata' | 'Diaria' | 'Semanal';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notifications: NotificationSettings;
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    allowContact: boolean;
  };
}

export interface FormularioRegistro {
  nombres: string;
  apellidos: string;
  cedula: string;
  correo: string;
  telefono: string;
  celular: string;
  fechaNacimiento: string;
  ciudad_id: number;
  password?: string;
  confirmPassword?: string;
  aceptaTerminos: boolean;
  aceptaPrivacidad: boolean;
}

export interface FormularioSolicitud {
  mascota_id: number;
  observaciones: string;
  experiencia_previa: boolean;
  tipo_vivienda: 'Casa' | 'Apartamento' | 'Quinta';
  tiene_patio: boolean;
  otros_animales: boolean;
  tiempo_disponible: string;
  motivo_adopcion: string;
  contacto_emergencia: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
}

export interface FormularioMascota {
  nombre: string;
  tipo_mascota_id: number;
  edad: string;
  genero: 'Macho' | 'Hembra';
  peso?: number;
  color?: string;
  personalidad?: string[];
  estado_id: number;
  salud2_id: number;
  centro_id: number;
  ciudad_id: number;
  responsable_id: number;
  observaciones: string;
  necesidades_especiales?: string;
  vacunas_al_dia: boolean;
  fecha_ingreso: string;
  historia?: string;
}

export interface EstadisticasDashboard {
  totalUsuarios: number;
  usuariosActivos: number;
  totalMascotas: number;
  mascotasDisponibles: number;
  totalSolicitudes: number;
  solicitudesPendientes: number;
  adopcionesAprobadas: number;
  adopcionesEsteMes: number;
}

export interface EstadisticasDetalladas {
  adopcionesPorMes: { mes: string; cantidad: number }[];
  tiposMascotasPopulares: { tipo: string; cantidad: number }[];
  ciudadesConMasAdopciones: { ciudad: string; cantidad: number }[];
  tiempoPromedioAdopcion: number;
  tasaExitoAdopcion: number;
}

export interface FiltroMascotas {
  tipo?: string;
  edad?: string;
  ciudad?: string;
  estado?: string;
  genero?: string;
  tamaño?: string;
  busqueda?: string;
}

export interface FiltroSolicitudes {
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  mascota?: string;
  usuario?: string;
}

export interface FiltroUsuarios {
  tipo?: string;
  estado?: string;
  ciudad?: string;
  fechaRegistroInicio?: string;
  fechaRegistroFin?: string;
  busqueda?: string;
}

export interface OpcionesPaginacion {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Denuncias {
  id?: number;
  observaciones: TipoMascotaEnum;
  direccion?: string;
  ciudad?: number;
  tipo_mascota?: number;
  foto?: string;
}

export {
  TipoUsuario,
  EstadoUsuario,
  EstadoSolicitud,
  EstadoMascota,
  EstadoAdopcion,
  TipoMascotaEnum,
  EstadoSalud

}

export interface Evento {
  id?: number;
  titulo: string;
  descripcion: string;
  direccion?: string;
  fecha_evento: string;
  fecha_fin_evento?: string;
  fecha_inicio_vigencia: string;
  fecha_fin_vigencia: string;
  foto?: string;
  activo?: boolean;
  destacado?: boolean;
  tipo_evento: 'Campaña' | 'Evento' | 'Noticia' | 'Adopción';
  ciudad_id?: number;
  centro_id?: number;
  creado_por?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  contacto_telefono?: string;
  contacto_email?: string;
  url_externa?: string;
  cupo_maximo?: number;
  cupo_actual?: number;
  requiere_registro?: boolean;
  tags?: string;

  // Campos calculados/relacionados
  ciudad_nombre?: string;
  centro_nombre?: string;
  creador_nombre?: string;
  estado_vigencia?: 'vigente' | 'programado' | 'vencido';
  estado_cupo?: 'disponible' | 'lleno' | 'sin_limite';
}

export interface EventoDetalle extends Evento {
  participantes?: ParticipanteEvento[];
  historial?: HistorialEvento[];
}

export interface ParticipanteEvento {
  id?: number;
  evento_id: number;
  usuario_id: number;
  usuario_tipo: 'adoptante' | 'empleado';
  fecha_registro: string;
  asistio?: boolean;
  observaciones?: string;
}

export interface HistorialEvento {
  id?: number;
  evento_id: number;
  usuario_id: number;
  accion: string;
  descripcion?: string;
  fecha: string;
}

export interface FormularioEvento {
  titulo: string;
  descripcion: string;
  direccion?: string;
  fecha_evento: string;
  fecha_fin_evento?: string;
  fecha_fin_vigencia: string;
  tipo_evento: 'Campaña' | 'Evento' | 'Noticia' | 'Adopción';
  ciudad_id?: number;
  centro_id?: number;
  contacto_telefono?: string;
  contacto_email?: string;
  url_externa?: string;
  cupo_maximo?: number;
  requiere_registro: boolean;
  tags?: string;
  destacado: boolean;
};
