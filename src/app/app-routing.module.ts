import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsLoggedGuard } from './auth/guards/is-logged.guard';
import { RolesGuardAdmin } from './auth/guards/rolesAdmin.guard';
import { Page404Component } from './shared/components/page404/page404.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'client',
    loadChildren: () => import('./pages/client/client.module').then(m => m.ClientModule),
    canActivate: [IsLoggedGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [IsLoggedGuard, RolesGuardAdmin]
  },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', component: Page404Component, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
