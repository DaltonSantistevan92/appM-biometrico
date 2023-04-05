import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private _autSer: AuthService, private router:Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._autSer.token;

    if (token) {
      req = req.clone({
        setHeaders:{ "Authorization":`Bearer ${token}` }
      });  
    }
    return next.handle(req);
  }
}
