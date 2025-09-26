import {Component, Input, OnInit} from '@angular/core';
import {AlertController, IonicModule, MenuController, ToastController} from "@ionic/angular";
import {NgIf} from "@angular/common";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {HeaderService} from "./header.service";
import {Solicitud} from "../../models/interfaces";

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
    imports: [
        IonicModule,
        NgIf,
        RouterLink,
        RouterOutlet
    ]
})
export class MainLayoutComponent implements OnInit {
    @Input() titulo: string = 'PAE Adopciones';
    @Input() vistaActual: string = 'dashboard';
    @Input() data = {
        usuarios: [],
        mascotas: [],
        solicitudes: [] as Solicitud[],
        tiposMascota: [],
        centros: [],
        ciudades: []
    };

    usuario: any = null; // o como lo manejes

    // NUEVA PROPIEDAD: Estado de las secciones colapsables
    secciones = {
        gestion: true,        // Gestión Principal - abierta por defecto
        configuracion: false, // Configuración - cerrada por defecto
        navegacion: false     // Navegación - cerrada por defecto
    };

    constructor(private router: Router, private alertController: AlertController,
                private menuController: MenuController,
                private apiService: ApiService,
                private headerService: HeaderService,
                private authService: AuthService,
                private toastController: ToastController) {

    }

    ngOnInit() {
        this.headerService.titulo$.subscribe(t => this.titulo = t);
        this.headerService.data$.subscribe(t => this.data = t);
        this.headerService.vistaActual$.subscribe(t => this.vistaActual = t);
        this.authService.getUsuarioActual().subscribe(usuario => {
            this.usuario = usuario;
        });

        // Inicializar secciones basado en el rol y estado
        this.inicializarSecciones();
    }

    // NUEVO MÉTODO: Inicializar estado de secciones
    private inicializarSecciones() {
        if (this.usuario?.tipoUsuario === 'admin') {
            // Si hay solicitudes pendientes, abrir la sección de gestión
            const solicitudesPendientes = this.getSolicitudesPendientes();
            const denunciasPendientes = this.getDenunciasPendientes();
            
            this.secciones = {
                gestion: true, // Siempre abierta para admin
                configuracion: false,
                navegacion: false
            };

            // Si hay alertas urgentes, expandir sección relevante
            if (solicitudesPendientes > 0 || denunciasPendientes > 0) {
                this.secciones.gestion = true;
            }

            // Cargar preferencias guardadas
            this.cargarPreferenciasSecciones();
        }
    }

    // NUEVO MÉTODO: Alternar estado de sección
    toggleSection(seccion: string) {
        if (this.secciones.hasOwnProperty(seccion)) {
            this.secciones[seccion as keyof typeof this.secciones] = 
                !this.secciones[seccion as keyof typeof this.secciones];
            
            // Guardar preferencia (opcional)
            this.guardarPreferenciasSecciones();
        }
    }

    // NUEVO MÉTODO: Guardar preferencias de secciones
    private guardarPreferenciasSecciones() {
        try {
            if (typeof Storage !== 'undefined') {
                localStorage.setItem('menu_secciones_estado', JSON.stringify(this.secciones));
            }
        } catch (error) {
            console.log('No se pudieron guardar las preferencias del menú');
        }
    }

    // NUEVO MÉTODO: Cargar preferencias de secciones
    private cargarPreferenciasSecciones() {
        try {
            if (typeof Storage !== 'undefined') {
                const guardado = localStorage.getItem('menu_secciones_estado');
                if (guardado) {
                    const preferencias = JSON.parse(guardado);
                    this.secciones = { ...this.secciones, ...preferencias };
                }
            }
        } catch (error) {
            console.log('No se pudieron cargar las preferencias del menú');
        }
    }

    // NUEVO MÉTODO: Obtener número de denuncias pendientes
    getDenunciasPendientes(): number {
        // Implementar según tu lógica de denuncias
        // Por ahora retorna 0, pero deberías conectarlo con tu servicio de denuncias
        return 0; // this.data.denuncias?.filter(d => d.estado === 'Pendiente').length || 0;
    }

    // MÉTODO MEJORADO: Navegación con auto-colapso en móvil
    navegarA(vista: string) {
        this.router.navigate(['/admin']);
        this.headerService.setVistaActual(vista);
        
        // Auto-cerrar menú en dispositivos móviles
        if (this.isMobile()) {
            this.closeMenu();
        }
    }

    // MÉTODO MEJORADO: Navegación directa con auto-colapso
    navegarDirect(vista: string) {
        this.router.navigate([vista]);
        
        // Auto-cerrar menú en dispositivos móviles
        if (this.isMobile()) {
            this.closeMenu();
        }
    }

    // NUEVO MÉTODO: Detectar si es dispositivo móvil
    private isMobile(): boolean {
        return window.innerWidth < 768;
    }

    // NUEVO MÉTODO: Navegar y expandir sección si es necesario
    navegarYExpandir(vista: string, seccion?: string) {
        if (seccion && !this.secciones[seccion as keyof typeof this.secciones]) {
            this.secciones[seccion as keyof typeof this.secciones] = true;
        }
        this.navegarA(vista);
    }

    // NUEVO MÉTODO: Verificar si hay alertas críticas
    hayAlertasCriticas(): boolean {
        return this.getSolicitudesPendientes() > 0 || this.getDenunciasPendientes() > 0;
    }

    // NUEVO MÉTODO: Obtener color del badge según prioridad
    getBadgeColor(cantidad: number, tipo: 'normal' | 'warning' | 'danger' = 'normal'): string {
        if (cantidad === 0) return 'medium';
        
        switch (tipo) {
            case 'warning':
                return cantidad > 5 ? 'danger' : 'warning';
            case 'danger':
                return 'danger';
            default:
                return cantidad > 10 ? 'warning' : 'primary';
        }
    }

    // NUEVO MÉTODO: Formatear números para badges
    formatearBadge(numero: number): string {
        if (numero > 99) return '99+';
        return numero.toString();
    }

    // NUEVO MÉTODO: Obtener mascotas disponibles
    getMascotasDisponibles(): number {
        return this.data.mascotas.filter((m: any) => m.estadoAdopcion === 'Disponible' || m.estado === 'Disponible').length || 0;
    }

    // NUEVO MÉTODO: Obtener usuarios activos
    getUsuariosActivos(): number {
        return this.data.usuarios.filter((u: any) => u.estado === 'activo').length || 0;
    }

    // NUEVO MÉTODO: Obtener adopciones exitosas
    getAdopcionesExitosas(): number {
        return this.data.solicitudes.filter(s => s.estado === 'Aprobado').length;
    }

    // NUEVO MÉTODO: Obtener estadísticas para el dashboard
    getEstadisticas() {
        return {
            totalUsuarios: this.getTotalUsuarios(),
            usuariosActivos: this.getUsuariosActivos(),
            totalMascotas: this.getTotalMascotas(),
            mascotasDisponibles: this.getMascotasDisponibles(),
            totalSolicitudes: this.getTotalSolicitudes(),
            solicitudesPendientes: this.getSolicitudesPendientes(),
            adopcionesExitosas: this.getAdopcionesExitosas(),
            denunciasPendientes: this.getDenunciasPendientes()
        };
    }

    irAPerfil() {
        this.router.navigate(['/perfil']);
    }

    irAlogin() {
        this.router.navigate(['/login']);
    }

    async closeMenu() {
        await this.menuController.close();
    }

    async cerrarSesion() {
        const alert = await this.alertController.create({
            header: 'Cerrar Sesión',
            message: '¿Estás seguro de que quieres cerrar sesión?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Cerrar Sesión',
                    handler: async () => {
                        await this.authService.logout();
                        this.router.navigate(['/home']);
                        this.mostrarToast('Sesión cerrada correctamente', 'success');
                    }
                }
            ]
        });

        await alert.present();
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

    getTotalUsuarios(): number {
        return this.data.usuarios.length;
    }

    getTotalMascotas(): number {
        return this.data.mascotas.length;
    }

    getTotalSolicitudes(): number {
        return this.data.solicitudes.length;
    }

    getSolicitudesPendientes(): number {
        return this.data.solicitudes.filter(s => s.estado === 'Pendiente').length;
    }
}