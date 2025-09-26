import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';
import {MainLayoutComponent} from "./components/main-layout/main-layout.component";

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'recover-pass',
    loadChildren: () => import('./pages/recover-pass/recover-pass.module').then( m => m.RecoverPassPageModule)
  },
  {
    path: 'evento-modal',
    loadChildren: () => import('./components/evento-modal/evento-modal.module').then( m => m.EventoModalPageModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'eventos',
        loadComponent: () => import('./pages/eventos/eventos.page').then(m => m.EventosPage)
      },
      {
        path: 'mascotas',
        loadChildren: () => import('./pages/mascotas/mascotas.module').then(m => m.MascotasPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'solicitudes',
        loadChildren: () => import('./pages/solicitudes/solicitudes.module').then(m => m.SolicitudesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule),
        canActivate: [AdminGuard]
      },
      {
        path: 'denuncias',
        loadChildren: () => import('./pages/denuncias/denuncias.module').then(m => m.DenunciasPageModule)
      },
      {
        path: 'denuncias-admin',
        loadChildren: () => import('./pages/denuncias-admin/denuncias-admin.module').then(m => m.DenunciasAdminPageModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}