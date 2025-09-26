import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../components/main-layout/header.service';
import { Evento, Usuario } from '../../models/interfaces';
import { EventoModalComponent } from '../../components/evento-modal/evento-modal.page';
import { EventoCardComponent } from '../../components/evento-card/evento-card.page';
import { EmptyStateComponent } from 'src/app/components/empty-state/empty-state.page';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.page';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventoCardComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ]
})
export class EventosPage implements OnInit {
  usuario: Usuario | null = null;
  cargando = false;

  // Eventos para admin - todos los eventos
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  filtroTipo = 'todos';
  
  // Eventos para adoptante - solo vigentes
  eventosVigentes: Evento[] = [];
  eventosVigentesAdoptante: Evento[] = [];
  eventosDestacados: Evento[] = [];
  filtroTipoAdoptante = 'todos';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private headerService: HeaderService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.headerService.setTitulo('Eventos');
    
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.cargarEventos();
    });
  }

  async cargarEventos() {
    this.cargando = true;

    try {
      if (this.usuario?.tipoUsuario === 'admin') {
        await this.cargarTodosLosEventos();
      } else {
        await this.cargarEventosVigentes();
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      this.mostrarToast('Error al cargar eventos', 'danger');
    } finally {
      this.cargando = false;
    }
  }

  // CORREGIDO - Cargar todos los eventos para admin
  private async cargarTodosLosEventos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerEventos().subscribe({
        next: (eventos: Evento[]) => {
          console.log('Eventos recibidos para admin:', eventos);
          this.eventos = eventos || [];
          this.filtrarEventos();
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar eventos para admin:', error);
          this.eventos = [];
          this.eventosFiltrados = [];
          reject(error);
        }
      });
    });
  }

  // CORREGIDO - Cargar eventos vigentes para adoptantes
  private async cargarEventosVigentes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.obtenerEventosVigentes().subscribe({
        next: (eventos: Evento[]) => {
          console.log('Eventos vigentes recibidos:', eventos);
          this.eventosVigentes = eventos || [];
          this.eventosDestacados = this.eventosVigentes.filter(e => e.destacado) || [];
          this.filtrarEventosAdoptante();
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar eventos vigentes:', error);
          this.eventosVigentes = [];
          this.eventosDestacados = [];
          this.eventosVigentesAdoptante = [];
          reject(error);
        }
      });
    });
  }

  // CORREGIDO - Filtrar eventos para admin
  filtrarEventos() {
    if (!this.eventos || this.eventos.length === 0) {
      this.eventosFiltrados = [];
      return;
    }

    let eventosFiltrar = [...this.eventos];

    // Filtrar por estado de vigencia
    switch (this.filtroTipo) {
      case 'vigentes':
        eventosFiltrar = eventosFiltrar.filter(e => e.estado_vigencia === 'vigente');
        break;
      case 'programados':
        eventosFiltrar = eventosFiltrar.filter(e => e.estado_vigencia === 'programado');
        break;
      case 'vencidos':
        eventosFiltrar = eventosFiltrar.filter(e => e.estado_vigencia === 'vencido');
        break;
      default:
        // 'todos' - no filtrar
        break;
    }

    // Ordenar por fecha de creación (más recientes primero)
    eventosFiltrar.sort((a, b) => {
      const fechaA = a.fecha_creacion ? new Date(a.fecha_creacion).getTime() : 0;
      const fechaB = b.fecha_creacion ? new Date(b.fecha_creacion).getTime() : 0;
      return fechaB - fechaA;
    });

    this.eventosFiltrados = eventosFiltrar;
    console.log('Eventos filtrados para admin:', this.eventosFiltrados);
  }

  // CORREGIDO - Filtrar eventos para adoptantes
  filtrarEventosAdoptante() {
    if (!this.eventosVigentes || this.eventosVigentes.length === 0) {
      this.eventosVigentesAdoptante = [];
      return;
    }

    let eventosFiltrar = [...this.eventosVigentes];

    // Filtrar por tipo de evento
    if (this.filtroTipoAdoptante !== 'todos') {
      eventosFiltrar = eventosFiltrar.filter(e => e.tipo_evento === this.filtroTipoAdoptante);
    }

    // Excluir eventos destacados de la lista principal
    eventosFiltrar = eventosFiltrar.filter(e => !e.destacado);

    // Ordenar por fecha del evento (próximos primero)
    eventosFiltrar.sort((a, b) => {
      const fechaA = new Date(a.fecha_evento).getTime();
      const fechaB = new Date(b.fecha_evento).getTime();
      return fechaA - fechaB;
    });

    this.eventosVigentesAdoptante = eventosFiltrar;
    console.log('Eventos filtrados para adoptante:', this.eventosVigentesAdoptante);
  }

  async abrirModalEvento(editar: boolean, evento: Evento | null) {
    const modal = await this.modalCtrl.create({
      component: EventoModalComponent,
      componentProps: {
        evento: evento || {},
        editar
      },
      cssClass: 'evento-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.success) {
      await this.cargarEventos();
    }
  }

  editarEvento(evento: Evento) {
    this.abrirModalEvento(true, evento);
  }

  async eliminarEvento(evento: Evento) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar el evento "${evento.titulo}"?`,
      subHeader: 'Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            if (evento.id) {
              this.procesarEliminacionEvento(evento.id);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async procesarEliminacionEvento(id: number) {
    this.cargando = true;

    this.apiService.eliminarEvento(id).subscribe({
      next: async (response: any) => {
        if (response.success) {
          this.mostrarToast('Evento eliminado correctamente', 'success');
          await this.cargarEventos();
        } else {
          this.mostrarToast('Error al eliminar evento', 'danger');
        }
        this.cargando = false;
      },
      error: async (error: any) => {
        this.mostrarToast('Error al eliminar evento', 'danger');
        console.error('Error:', error);
        this.cargando = false;
      }
    });
  }

  async inscribirseEvento(evento: Evento) {
    if (!this.usuario) {
      this.mostrarToast('Inicia sesión para inscribirte', 'warning');
      return;
    }

    if (!evento.requiere_registro) {
      this.mostrarToast('Este evento no requiere inscripción previa', 'primary');
      return;
    }

    if (evento.cupo_maximo && evento.cupo_actual && 
        evento.cupo_actual >= evento.cupo_maximo) {
      this.mostrarToast('No hay cupos disponibles', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Inscripción',
      message: `¿Deseas inscribirte al evento "${evento.titulo}"?`,
      subHeader: evento.fecha_evento ? 
        `Fecha: ${this.formatearFechaLarga(evento.fecha_evento)}` : undefined,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Inscribirme',
          handler: () => {
            this.procesarInscripcion(evento);
          }
        }
      ]
    });

    await alert.present();
  }

  private async procesarInscripcion(evento: Evento) {
    try {
      // Aquí iría la lógica real de inscripción a través de la API
      this.mostrarToast('Inscripción registrada correctamente', 'success');
      
      // Actualizar cupo actual si es necesario
      if (evento.cupo_actual !== undefined) {
        evento.cupo_actual += 1;
      }
    } catch (error) {
      console.error('Error en inscripción:', error);
      this.mostrarToast('Error al procesar inscripción', 'danger');
    }
  }

  verDetallesEvento(evento: Evento) {
    this.mostrarDetallesEvento(evento);
  }

  // MODAL DE DETALLES MEJORADO
  async mostrarDetallesEvento(evento: Evento) {
    const detalles = this.construirDetallesEvento(evento);
    
    const alert = await this.alertController.create({
      header: evento.titulo,
      subHeader: `${evento.tipo_evento} - ${this.getEstadoTexto(evento)}`,
      message: detalles,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        ...(evento.requiere_registro && this.canRegister(evento) ? [{
          text: 'Inscribirse',
          handler: () => {
            this.inscribirseEvento(evento);
          }
        }] : []),
        ...(evento.url_externa ? [{
          text: 'Más Info',
          handler: () => {
            window.open(evento.url_externa, '_blank');
          }
        }] : [])
      ],
      cssClass: 'evento-details-alert'
    });

    await alert.present();
  }

  private construirDetallesEvento(evento: Evento): string {
    let detalles = '';
    
    if (evento.descripcion) {
      detalles += `<p><strong>Descripción:</strong><br>${evento.descripcion}</p>`;
    }
    
    if (evento.fecha_evento) {
      detalles += `<p><strong>📅 Fecha:</strong> ${this.formatearFechaLarga(evento.fecha_evento)}</p>`;
    }
    
    if (evento.direccion) {
      detalles += `<p><strong>📍 Dirección:</strong> ${evento.direccion}</p>`;
    }
    
    if (evento.ciudad_nombre) {
      detalles += `<p><strong>🏙️ Ciudad:</strong> ${evento.ciudad_nombre}</p>`;
    }
    
    if (evento.centro_nombre) {
      detalles += `<p><strong>🏢 Centro:</strong> ${evento.centro_nombre}</p>`;
    }
    
    if (evento.cupo_maximo) {
      detalles += `<p><strong>👥 Participantes:</strong> ${evento.cupo_actual || 0}/${evento.cupo_maximo}</p>`;
    }
    
    if (evento.contacto_telefono) {
      detalles += `<p><strong>📞 Teléfono:</strong> ${evento.contacto_telefono}</p>`;
    }
    
    if (evento.contacto_email) {
      detalles += `<p><strong>📧 Email:</strong> ${evento.contacto_email}</p>`;
    }
    
    if (evento.fecha_fin_vigencia) {
      detalles += `<p><strong>⏰ Vigente hasta:</strong> ${this.formatearFechaLarga(evento.fecha_fin_vigencia)}</p>`;
    }
    
    if (evento.creador_nombre) {
      detalles += `<p><strong>👤 Creado por:</strong> ${evento.creador_nombre}</p>`;
    }
    
    return detalles;
  }

  private getEstadoTexto(evento: Evento): string {
    switch (evento.estado_vigencia) {
      case 'vigente': return 'Vigente';
      case 'programado': return 'Programado';
      case 'vencido': return 'Finalizado';
      default: return 'Sin estado';
    }
  }

  private canRegister(evento: Evento): boolean {
    if (!evento.requiere_registro) return false;
    if (evento.estado_vigencia !== 'vigente') return false;
    if (evento.cupo_maximo && evento.cupo_actual && 
        evento.cupo_actual >= evento.cupo_maximo) return false;
    return true;
  }

  getEmptyMessage(): string {
    switch (this.filtroTipo) {
      case 'vigentes':
        return 'No hay eventos vigentes en este momento';
      case 'programados':
        return 'No hay eventos programados';
      case 'vencidos':
        return 'No hay eventos finalizados';
      default:
        return 'No hay eventos registrados. Crea el primer evento.';
    }
  }

  getTituloSeccion(): string {
    switch (this.filtroTipoAdoptante) {
      case 'Evento':
        return 'Próximos Eventos';
      case 'Campaña':
        return 'Campañas Activas';
      case 'Noticia':
        return 'Últimas Noticias';
      case 'Adopción':
        return 'Ferias de Adopción';
      default:
        return 'Todos los Eventos';
    }
  }

  trackByEventoId(index: number, evento: Evento): number {
    return evento.id || index;
  }

  async doRefresh(event: any) {
    try {
      await this.cargarEventos();
    } finally {
      event.target.complete();
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  // Función auxiliar para formatear fechas largas
  private formatearFechaLarga(fecha: string): string {
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return fecha;
    }
  }
}