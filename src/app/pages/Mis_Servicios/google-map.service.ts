import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
declare var google:any;

declare var window: Window & typeof globalThis;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  apiKey = environment.apiKeyGoogle;
  mapsLoaded = false;//bandera si la libreria de google esta cargada

  constructor() { }

  init(renderer:any, document:any):Promise<any>{
    return new Promise((resolve) =>{

      if(this.mapsLoaded){
        console.log('google está cargado de vista previa');
        resolve(true);
        return;
      } 

      const script = renderer.createElement('script');
      script.id = 'googleMaps';

      window.setTimeout(() =>{
        this.mapsLoaded = true;
        if(google){
          console.log('Google está cargado');
        }else{
          console.log('Google no está definido'); 
        }
        resolve(true);
        return;
      }, 500);

      if(this.apiKey){
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback`;
      }else{
        script.src = `https://maps.googleapis.com/maps/api/js?callback`;
      }

      renderer.appendChild(document.body, script);
    });

  }


  /*  window['initMap'] = () => {
        this.mapsLoaded = true;
        if(google){
          console.log('Google está cargado');
        }else{
          console.log('Google no está definido'); 
        }
        resolve(true);
        return;
      } */


}
