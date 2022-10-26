import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { ClientComponent } from './client.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProvincesComponent } from './perfil/fields/provinces/provinces.component';
import { DepartamentComponent } from './perfil/fields/departament/departament.component';
import { LocationComponent } from './perfil/fields/location/location.component';
import { DialogsComponent } from './perfil/dialogs/dialogs.component';


@NgModule({
  declarations: [
    HomeComponent,
    ClientComponent,
    PerfilComponent,
    ProvincesComponent,
    DepartamentComponent,
    LocationComponent,
    DialogsComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    MaterialModule
  ]
})
export class ClientModule { }
