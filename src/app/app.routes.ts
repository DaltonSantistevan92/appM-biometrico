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
  /* {
    path: 'dactilar',
    canActivate: [AuthGuardGuard],
    loadComponent: () => import('./pages/reconocimiento-dactilar/reconocimiento-dactilar.page').then( m => m.ReconocimientoDactilarPage)
  }, */
  {
<<<<<<< HEAD
=======
    path: 'datos/perfil',
    canActivate: [AuthGuardGuard],
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
>>>>>>> 3107cc3aecefb3cdba4332cf487135c40b699b5d
    path: 'card',
    loadComponent: () => import('./componentes/card/card.page').then( m => m.CardPage)
  },
  {
<<<<<<< HEAD
=======
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
<<<<<<< HEAD
>>>>>>> 3107cc3aecefb3cdba4332cf487135c40b699b5d
=======
    path: 'vista',
    loadComponent: () => import('./reporte/vista/vista.page').then( m => m.VistaPage)
  },
  {
>>>>>>> de289cc444eb6eb02eb513bfe6ea628588f1fb3f
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
<<<<<<< HEAD
  
<<<<<<< HEAD


  
  
];

=======

  

=======
>>>>>>> de289cc444eb6eb02eb513bfe6ea628588f1fb3f
];
>>>>>>> 3107cc3aecefb3cdba4332cf487135c40b699b5d
