import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventoCardComponent } from './evento-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventoCardComponent 
  ],
  exports: [EventoCardComponent]
})
export class EventoCardPageModule {}