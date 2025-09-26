import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'; // <- Agregar CUSTOM_ELEMENTS_SCHEMA
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage-angular';

// Importar y registrar Swiper - AGREGAR ESTAS 2 LÍNEAS
import { register } from 'swiper/element/bundle';
register();

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {ApiService} from './services/api.service';
import {AuthService} from './services/auth.service';

import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';
import {SharedModule} from "./shared/shared.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({innerHTMLTemplatesEnabled: true}),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    SharedModule
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    ApiService,
    AuthService,
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // <- Agregar esta línea
})
export class AppModule {
}