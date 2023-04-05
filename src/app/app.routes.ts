import { Routes } from '@angular/router';
import { AuthGuardGuard } from './auth/guards/auth-guard.guard';
import { AutoLoginGuard } from './auth/guards/auto-login.guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage),
    canActivate : [AutoLoginGuard]
  },
  {
    path: 'registro',
    loadComponent: () => import('./auth/registro/registro.page').then( m => m.RegistroPage),
    canActivate : [AutoLoginGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuardGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  
  
];
