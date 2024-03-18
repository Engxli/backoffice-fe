// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AppRoutes } from './models/AppRoutes';
import { NoAuthGuard } from './guards/noAuth.guard';

const routes: Routes = [
  {
    path: AppRoutes.Login,
    component: LoginComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: AppRoutes.Dashboard,
    component: MainComponent,
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    redirectTo: AppRoutes.Login,
  },
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
