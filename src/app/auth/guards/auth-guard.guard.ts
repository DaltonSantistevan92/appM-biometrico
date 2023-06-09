import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable,tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from 'src/app/pages/Mis_Servicios/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private _autSer: AuthService, private router: Router,private storage: StorageService){} 

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
     return this._autSer.verificacionAutenticacion()
      .pipe(tap(estaAutenticado => {
          if (!estaAutenticado) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('menu');
              localStorage.removeItem('tipo');
              localStorage.removeItem('tipo_asistencia');
              this.storage.remove('biometric');
              this.router.navigate(['/login']);
          }
      })
     ); 
  }

  
}
