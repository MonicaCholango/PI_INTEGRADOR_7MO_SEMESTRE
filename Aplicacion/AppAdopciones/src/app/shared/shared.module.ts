// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoPipe } from '../pipes/photo.pipe';

@NgModule({
  declarations: [],
  exports: [PhotoPipe],
  imports: [CommonModule, PhotoPipe]
})
export class SharedModule {}
