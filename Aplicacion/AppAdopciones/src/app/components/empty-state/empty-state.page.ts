import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.page.html',
  styleUrls: ['./empty-state.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class EmptyStateComponent {
  @Input() icon: string = 'folder-open-outline';
  @Input() title: string = 'No hay datos';
  @Input() subtitle: string = 'No se encontraron elementos para mostrar';
  @Input() actionText?: string;
  @Input() secondaryActionText?: string;
  @Input() iconColor: string = 'medium';
  @Input() showImage: boolean = false;
  @Input() imageUrl?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() onAction = new EventEmitter<void>();
  @Output() onSecondaryAction = new EventEmitter<void>();

  constructor() {}

  handleAction(): void {
    this.onAction.emit();
  }

  handleSecondaryAction(): void {
    this.onSecondaryAction.emit();
  }

  get containerClasses(): string {
    return `empty-state-container size-${this.size}`;
  }

  get iconSize(): string {
    switch (this.size) {
      case 'small':
        return '3rem';
      case 'large':
        return '6rem';
      default:
        return '4rem';
    }
  }
}