import { Routes } from '@angular/router';
import { AuthGuardGuard } from './auth/guards/auth-guard.guard';
import { AutoLoginGuard } from './auth/guards/auto-login.guard';


export const routes: Routes = [
  {
    path: 'login',
    canActivate : [AutoLoginGuard],
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage),
  },
  {
    path: 'registro',
    canActivate : [AutoLoginGuard],
    loadComponent: () => import('./auth/registro/registro.page').then( m => m.RegistroPage),
  },
  {
    path: 'home',
    canActivate: [AuthGuardGuard],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'asistencia/registrar',
    canActivate: [AuthGuardGuard],
    loadComponent: () => import('./pages/asistencia/asistencia.page').then( m => m.AsistenciaPage)
  },
  {
    path: 'dactilar',
    canActivate: [AuthGuardGuard],
    loadComponent: () => import('./pages/reconocimiento-dactilar/reconocimiento-dactilar.page').then( m => m.ReconocimientoDactilarPage)
  },
  {
    path: 'datos/perfil',
    canActivate: [AuthGuardGuard],
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'card',
    loadComponent: () => import('./componentes/card/card.page').then( m => m.CardPage)
  },
  {
    path: 'ringreso',
    canActivate: [AuthGuardGuard],
    loadComponent: () => import('./reporte/ringreso/ringreso.page').then( m => m.RIngresoPage)
  },
  {
    path: 'datos/updatepassword',
    canActivate: [AuthGuardGuard],
    loadComponent: () => import('./pages/contrasena/contrasena.page').then( m => m.ContrasenaPage)
  },
  {
    path: 'vista',
    loadComponent: () => import('./reporte/vista/vista.page').then( m => m.VistaPage)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
