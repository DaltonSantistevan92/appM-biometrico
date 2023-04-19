import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataDateTime, IntTipo } from '../interfaces/misInterface';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class MiserviciosService {
  API = environment.apiUrl;

   public useLocation?: [number, number];

   get isUserLocation(): boolean {//getter de localización
     return !!this.useLocation;
   }
 
  constructor(
    private http: HttpClient,
    public alertController: AlertController
  ) { 
  }

  
  getDateHoras():Observable<DataDateTime>{
    let url = this.API + '/getDateTime';
    return this.http.get<DataDateTime>(url);
  }

  getTipos():Observable<IntTipo[]>{
    let url = this.API + '/getTipos';
    return this.http.get<IntTipo[]>(url);
  }

  saveAsistencia(data:any):Observable<any>{
    let url = this.API + '/asistencia';
    return this.http.post<any>(url,data);
  }

  getUltimaAsistencia(user_id:number):Observable<number>{
    let url = `${this.API}/search/${user_id}`;
    return this.http.get<number>(url);
  }

  getTiposAsistencias():Observable<any>{
    let url = this.API + '/getTipoAsistencia';
    return this.http.get<any>(url);
  }

  //'search/{user_id}

  /* //funcion para obtener las coordenads actual
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.useLocation = [coords.latitude, coords.longitude];
          resolve(this.useLocation);
        },
        (err) => { console.log('Error Active el localizador'); }
      );
    });
  } */


 

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Alerta",
      //subHeader: "No cargo",
      message: "No cargo Tipo Entrada",
      buttons: ["OK"]
    });

    await alert.present();
  }

  async presentGuardar() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Datos Guardos",
      //subHeader: "No cargo",
      message: "Con éxito",
      buttons: ["OK"]
    });

    await alert.present();
  }

  async presentErrorGuardar() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Datos No Guardos",
      //subHeader: "No cargo",
      message: "Caduco Token",
      buttons: ["OK"]
    });

    await alert.present();
  }


  updateUserPerfil(data:any):Observable<any>{
    let url = this.API + '/updateDataUser';
    return this.http.post<any>(url,data);
  }



}
