import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DenunciasAdminPageRoutingModule } from './denuncias-admin-routing.module';

import { DenunciasAdminPage } from './denuncias-admin.page';
import {PhotoPipe} from "../../pipes/photo.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DenunciasAdminPageRoutingModule,
    DenunciasAdminPage,PhotoPipe
  ],
  declarations: []
})
export class DenunciasAdminPageModule {}
