import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataDateTime, IntTipo } from '../interfaces/misInterface';

@Injectable({
  providedIn: 'root'
})
export class MiserviciosService {
  API = environment.apiUrl;
  Id_consumo:any;
  constructor(
    private http: HttpClient
  ) { }

  
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


}
