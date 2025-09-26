import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.page.html',
  styleUrls: ['./loading-spinner.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Cargando...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: string = 'primary';
  @Input() spinner: string = 'crescent';
  @Input() centered: boolean = true;
  @Input() fullscreen: boolean = false;
  @Input() overlay: boolean = false;
  @Input() transparent: boolean = false;

  constructor() {}

  get containerClasses(): string {
    const classes = ['loading-container'];
    
    if (this.centered) classes.push('centered');
    if (this.fullscreen) classes.push('fullscreen');
    if (this.overlay) classes.push('overlay');
    if (this.transparent) classes.push('transparent');
    
    return classes.join(' ');
  }

  get spinnerSize(): string {
    switch (this.size) {
      case 'small':
        return '24px';
      case 'large':
        return '64px';
      default:
        return '40px';
    }
  }
}