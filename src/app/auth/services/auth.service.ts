import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Formulario, RegIntTrabajador, ResponseTrabajador } from '../interfaces/registro.interface';
import { Observable, of, tap } from 'rxjs';
import { RespLogin } from '../interfaces/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  constructor(
    private route: Router,
    private toast:ToastController,
    private http: HttpClient
  ) { }

  api = environment.apiUrl;

  saveTrabajador(data:RegIntTrabajador): Observable<ResponseTrabajador>{
    const url = `${this.api}/registro`;
    return this.http.post<ResponseTrabajador>(url,data);
  }

  verificacionAutenticacion():Observable<boolean>{
    const token = localStorage.getItem('token');

    if (!token) { return of(false); }

    return of(true);
  }

  login(data:Formulario): Observable<RespLogin>{
    const url = `${this.api}/login`;
    return this.http.post<RespLogin>(url,data)
    .pipe(tap( (resp) => {
        if (resp.token) {
          localStorage.setItem('token', JSON.stringify(resp.token)); 
        }else{
          return;
        }
      })
    ).pipe(tap( (data) => {
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user)); 
      }else{
        return;
      }
    }));
  }


  irA(url: string) {
    this.route.navigateByUrl(url);
  }
  
  async Mensaje(texto: string, tipo: string = 'success') {
    let t = await this.toast.create({
      message: texto,
      color: tipo,
      duration: 3000
    });
    t.present();
  }


  
}
