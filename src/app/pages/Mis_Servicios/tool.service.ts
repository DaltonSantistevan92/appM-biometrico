import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  API = environment.apiUrl;

  constructor(
    private http : HttpClient
  ){ }

  mostrarArchivo(folder:string,file:string){
    let url = `${this.API}/mostrarImagen/${folder}/${file}`;
    return this.http.get(url , { responseType: 'blob' });
  }

  subirArchivo(files: Array<File>, name:string, url:string){
    let urlCompleta = `${this.API}/${url}`;
    let formdata = new FormData();
    
    if(files){
      for(let i = 0; i < files.length; i++){
        formdata.append(name + '-'+ i,files[i], files[i].name);
     }
    }
   return this.http.post(urlCompleta, formdata);
  }


  

}
