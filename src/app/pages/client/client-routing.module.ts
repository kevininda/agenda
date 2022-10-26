import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  {
    path: '', component: ClientComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
