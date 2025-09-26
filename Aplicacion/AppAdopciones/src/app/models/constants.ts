export const APP_CONSTANTS = {
  NAME: 'AppAdopciones',
  VERSION: '1.0.0',
  COMPANY: 'Protección Animal Ecuador',
  LOGO_URL: 'assets/images/logo/pae-logo.png',
  DEFAULT_MASCOTA_IMAGE: 'assets/images/placeholders/mascota-default.jpg',
  DEFAULT_EVENTO_IMAGE: 'assets/images/placeholders/evento-default.jpg',
  DEFAULT_USER_AVATAR: 'assets/images/placeholders/user-default.png',

  PAYPAL_URL: 'https://www.sandbox.paypal.com/checkoutnow?atomic-event-state=eyJkb21haW4iOiJzZGtfcGF5cGFsX3Y1IiwiZXZlbnRzIjpbXSwiaW50ZW50IjoiY2xpY2tfcGF5bWVudF9idXR0b24iLCJpbnRlbnRUeXBlIjoiY2xpY2siLCJpbnRlcmFjdGlvblN0YXJ0VGltZSI6NTU3ODYuNjk5OTk5OTk5MjU1LCJ0aW1lU3RhbXAiOjU1Nzg3LCJ0aW1lT3JpZ2luIjoxNzU4ODUwMzc3NzE1LjMsInRhc2siOiJzZWxlY3Rfb25lX3RpbWVfY2hlY2tvdXQiLCJmbG93Ijoib25lLXRpbWUtY2hlY2tvdXQiLCJ1aVN0YXRlIjoid2FpdGluZyIsInBhdGgiOiIvc21hcnQvYnV0dG9ucyIsInZpZXdOYW1lIjoicGF5cGFsLXNkayJ9&sessionID=uid_b14f8676c4_mde6mzi6ntc&buttonSessionID=uid_0c476f17d7_mde6mzi6ntc&stickinessID=uid_8d91a70f70_mjm6mdg6ndq&smokeHash=&sign_out_user=false&fundingSource=paypal&buyerCountry=EC&locale.x=es_ES&commit=true&client-metadata-id=uid_b14f8676c4_mde6mzi6ntc&enableFunding.0=venmo&token=0D656946725145223&clientID=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R&env=sandbox&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz9jbGllbnQtaWQ9c2ImZW5hYmxlLWZ1bmRpbmc9dmVubW8mY3VycmVuY3k9VVNEIiwiYXR0cnMiOnsiZGF0YS1zZGstaW50ZWdyYXRpb24tc291cmNlIjoiYnV0dG9uLWZhY3RvcnkiLCJkYXRhLXVpZCI6InVpZF96aHV1bGxtaWxmaXVtY3djamhsZHpyb215bW91eHIifX0&country.x=ES&xcomponent=1&integration_artifact=PAYPAL_JS_SDK&version=5.0.510&hasShippingCallback=false',
  
  DONACIONES_INFO: {
    title: 'Donaciones para PAE',
    description: 'Tu donación nos ayuda a rescatar, rehabilitar y encontrar hogares para mascotas en situación de vulnerabilidad.',
    bankAccount: '1234567890',
    bankName: 'Banco Pichincha',
    accountType: 'Cuenta Corriente',
    beneficiary: 'Protección Animal Ecuador',
    ruc: '1792345678001'
  }
};

export const API_CONSTANTS = {

  BASE_URL: 'http://localhost:80/Pae/',//fixme
  //BASE_URL: 'http://localhost:8080/',//fixme

  // AGREGADO: Rutas de upload
  UPLOAD_PATHS: {
    MASCOTAS: 'uploads/',
    EVENTOS: 'uploads/eventos/'
  },

  ENDPOINTS: {
    LOGIN: 'adopciones.php?action=login',
    REGISTER: 'adopciones.php?action=registrar',
    USUARIOS: 'adopciones.php?action=usuarios',
    MASCOTAS: 'adopciones.php?action=mascotas',
    MASCOTAS_DISPONIBLES: 'adopciones.php?action=mascotas_disponibles',
    SOLICITUDES: 'adopciones.php?action=solicitudes',
    SOLICITUDES_USUARIO: 'adopciones.php?action=solicitudes_usuario',
    CREAR_SOLICITUD: 'adopciones.php?action=crear_solicitud',
    ACTUALIZAR_SOLICITUD: 'adopciones.php?action=actualizar_solicitud',
    CIUDADES: 'adopciones.php?action=ciudades',
    CENTROS: 'adopciones.php?action=centros',
    TIPOS_MASCOTA: 'adopciones.php?action=tipos_mascota',
    ESTADOS: 'adopciones.php?action=estados',
    ESTADOS_ADOPCION: 'adopciones.php?action=estados_adopcion',
    ESTADOS_SALUD: 'adopciones.php?action=estados_salud',
    EMPLEADOS: 'adopciones.php?action=empleados',
    AGREGAR_CENTRO: 'adopciones.php?action=agregar_centro',
    AGREGAR_CIUDAD: 'adopciones.php?action=agregar_ciudad',
    AGREGAR_TIPO: 'adopciones.php?action=agregar_tipo',
    ESTADO_USUARIO: 'adopciones.php?action=estado_usuario',
    ACTUALIZAR_USUARIO: 'adopciones.php?action=actualizar_usuario',
    ACTUALIZAR_CENTRO: 'adopciones.php?action=actualizar_centro',
    ESTADO_CENTRO: 'adopciones.php?action=estado_centro',
    ELIMINAR_CENTRO: 'adopciones.php?action=eliminar_centro',
    ACTUALIZAR_CIUDAD: 'adopciones.php?action=actualizar_ciudad',
    ESTADO_CIUDAD: 'adopciones.php?action=estado_ciudad',
    ELIMINAR_CIUDAD: 'adopciones.php?action=eliminar_ciudad',
    ACTUALIZAR_TIPO: 'adopciones.php?action=actualizar_tipo',
    ESTADO_TIPO: 'adopciones.php?action=estado_tipo',
    ELIMINAR_TIPO: 'adopciones.php?action=eliminar_tipo',

    ACTUALIZAR_MASCOTA: 'adopciones.php?action=actualizar_mascota',
    ELIMINAR_MASCOTA: 'adopciones.php?action=eliminar_mascota',
    AGREGAR_MASCOTA: 'adopciones.php?action=agregar_mascota',

    PING: 'adopciones.php?action=ping',
    VERSION: 'adopciones.php?action=version',
    ESTADISTICAS: 'adopciones.php?action=estadisticas',
    DENUNCIAS: 'adopciones.php?action=listar_denuncias',

    // EVENTOS - endpoints corregidos
    EVENTOS: 'adopciones.php?action=eventos',
    EVENTOS_VIGENTES: 'adopciones.php?action=eventos_vigentes',
    AGREGAR_EVENTO: 'adopciones.php?action=agregar_evento',
    ACTUALIZAR_EVENTO: 'adopciones.php?action=actualizar_evento',
    ELIMINAR_EVENTO: 'adopciones.php?action=eliminar_evento',
    SUBIR_FOTO_EVENTO: 'adopciones.php?action=subir_foto_evento',
    SAVE_FOTO_EVENTO: 'adopciones.php?action=save_foto_evento', // AGREGADO
  }
};

export const VALIDATION_CONSTANTS = {
  CEDULA_LENGTH: 10,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_MIN_LENGTH: 7,
  PHONE_MAX_LENGTH: 15,
  OBSERVACIONES_MAX_LENGTH: 500,
  FILE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif']
};

export const UI_CONSTANTS = {
  TOAST_DURATION: 3000,
  LOADING_TIMEOUT: 10000,
  DEBOUNCE_TIME: 300,
  ANIMATION_DURATION: 300,
  REFRESH_TIMEOUT: 1000
};

export const STORAGE_KEYS = {
  USER: 'pae_usuario',
  TOKEN: 'pae_token',
  THEME: 'pae_theme',
  LANGUAGE: 'pae_language',
  LAST_SYNC: 'pae_last_sync',
  OFFLINE_DATA: 'pae_offline_data'
};

export const COLORS = {
  PRIMARY: '#6CC24A',
  PRIMARY_RGB: '108, 194, 74',
  PRIMARY_CONTRAST: '#ffffff',
  PRIMARY_SHADE: '#5fab41',
  PRIMARY_TINT: '#7bc85c',
  INSTITUTIONAL: '#84C341',
  SUCCESS: '#2dd36f',
  WARNING: '#ffc409',
  DANGER: '#eb445a',
  MEDIUM: '#92949c',
  LIGHT: '#f4f5f8',
  DARK: '#222428'
};

export const EXTERNAL_SERVICES = {
  DONACIONES: 'https://pae.ec/donaciones/',
  SORTEO_ANIMAL: 'https://pae.ec/sorteo-animal/',
  LABORATORIO: 'https://fundacion-pae.web.app/',
  CAMPANAS: 'https://pae.ec/campanas/',
  PROGRAMAS: 'https://pae.ec/programas/',
  CONTACTO: 'https://pae.ec/contactenos/'
};