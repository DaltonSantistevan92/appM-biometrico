import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Formulario, RegIntTrabajador, ResponseTrabajador } from '../interfaces/registro.interface';
import { Observable, of, tap } from 'rxjs';
import { Menu, RespLogin, User } from '../interfaces/auth.interface';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get user(): User {
    return JSON.parse(localStorage.getItem('user')!) || '';
  }

  private _listaMenus : any [] = [];  //lista de menus

  get menu(): any { //getter de menu
    return [...this._listaMenus];
  } 

  //private http = inject(HttpClient);
  constructor(
    private route: Router,
    private toast:ToastController,
    private http: HttpClient
  ) { 
    this._listaMenus = JSON.parse( localStorage.getItem('menu')!) || [];

  }

  api = environment.apiUrl;

  verificacionAutenticacion():Observable<boolean>{
    const token = localStorage.getItem('token');

    if (!token) { return of(false); }

    return of(true);
  }

  login(data:Formulario): Observable<RespLogin>{
    const url = `${this.api}/login`;
    return this.http.post<RespLogin>(url,data)
    .pipe(tap( (resp) => {
        if (resp.token && resp.user && resp.menu.length > 0) {
          localStorage.setItem('token', JSON.stringify(resp.token)); 
          localStorage.setItem('user', JSON.stringify(resp.user));

          this._listaMenus = resp.menu; // recuperamos el menu y lo igualmos a la lista
          localStorage.setItem('menu', JSON.stringify(this._listaMenus));
        }else{
          return;
        }
      })
    );
  }

  saveTrabajador(data:RegIntTrabajador): Observable<ResponseTrabajador>{
    const url = `${this.api}/registro`;
    return this.http.post<ResponseTrabajador>(url,data);
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
