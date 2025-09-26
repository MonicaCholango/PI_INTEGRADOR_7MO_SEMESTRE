import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DenunciasAdminPage } from './denuncias-admin.page';

const routes: Routes = [
  {
    path: '',
    component: DenunciasAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DenunciasAdminPageRoutingModule {}
