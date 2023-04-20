import { Component, OnInit, NgZone, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MiserviciosService } from '../Mis_Servicios/miservicios.service';
import { IntTipo } from '../interfaces/misInterface';
import { map, interval, tap , takeUntil, Subject, take } from 'rxjs';
import { GoogleMapService } from '../Mis_Servicios/google-map.service';

declare var google: any;

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AsistenciaPage implements OnInit {
  fecha: any; 
  filtered: any;
  formAsistencia!: FormGroup;
  listaTipos: IntTipo[] = []; 
  listaTiposAsistencia: any[] = []; 

  pipe = new DatePipe('en-Us');

  bandera: boolean = false;
  banderaUbicacion: boolean = false;

  //tipo_registro : string = '';
  cargandoUbicacion: boolean = false;

  //mapa
  
  map: any;  marker: any;  infowindow: any;  positionSet: any;

  @ViewChild('map') divMap!: ElementRef; //obtener el elemnt de la vista #map

  private stop$ = new Subject<number>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _authS :AuthService,
    private _misSe : MiserviciosService,
    private menuController: MenuController,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document:Document,
    private googleServ: GoogleMapService
    
  ) { }

  ngOnInit(): void {  
    this.menuController.enable(true);
    this.initFormAsistencia();
    this.setearEmail();
    this.traerTipoBd();
    this.selectTipos();
    this.getFecha(); 
    this.init();   
    
    //this.onValueChanges();

    this.getTiposAsistencia();
  }
  

  initFormAsistencia(){
    this.formAsistencia = this.fb.group({
			email: ['', [Validators.required]],
			fecha: [''],
      tipo_registro_id : [''],
      tipo_asistencia_id : ['', [Validators.required]],
      tipo_registro: [''],
      latitud : [''],
      longitud : [''],
      coordenadas : ['']
		});
  }

  getTiposAsistencia(){
    this._misSe.getTiposAsistencias().subscribe( {
      next: (resp) => {  this.listaTiposAsistencia = resp.data; }, 
      error: (err) => { console.log(err); }
    });
  }

  validarTipoAsistencia(event: any){
    this.bandera = true;
    if (event.detail.value == 1 ) {//asistencia
      this.banderaUbicacion = true; 
      this.setearEmail();
      this.selectTipos(); 
      this.getFecha();    
      this.printCurrentPosition();
    }else{//evento
      this.banderaUbicacion = false;
      this.setearEmail();
      this.selectTipos(); 
      this.getFecha();
    }
  }

  /* onValueChanges(): void {
    this.formAsistencia.valueChanges.subscribe(val => {
      console.log('value', val.tipo_asistencia_id);
    });
  } */

  traerTipoBd(){
    if (this._authS.user == null) {  return; }
    this._misSe.getUltimaAsistencia(this._authS.user.id).subscribe( (resp) =>{
      localStorage.setItem('tipo', JSON.stringify(resp))
    });
  }

  selectTipos(){
    this._misSe.getTipos()
      .pipe( map( (resp:IntTipo[]) => { resp.filter( r => {
          let tipo = JSON.parse(localStorage.getItem('tipo')!) || '';
         
          if ( (tipo == '' && r.id == 1)  ||  (tipo == 2  && r.id == 1) ||  (tipo == 1 && r.id == 2 ) ) {
            this.formAsistencia.get('tipo_registro_id')?.setValue(r.id);
            this.formAsistencia.get('tipo_registro')?.setValue(r.tipo);
          }else if (r.id == 2 && tipo == 1) {
            this.formAsistencia.get('tipo_registro_id')?.setValue(r.id);
            this.formAsistencia.get('tipo_registro')?.setValue(r.tipo);
          }
        });
      }))
      .subscribe({
      next: (resp) => { }, 
      error: (err) => { console.log(err); }
    });
  }

  setearEmail(){
    if (this._authS.user == null) {  return; }
    this.formAsistencia.get('email')?.setValue(this._authS.user.email);
    
    this.fecha = new Date(Date.now());
    this.fecha  = this.pipe.transform(this.fecha,'dd/MM/yyyy');

    const [day, month, year] =  this.fecha.split('/');
    const newFechaInicio = `${year}-${month}-${day}`;
    
    this.formAsistencia.get('fecha')?.setValue(newFechaInicio);
  }

  getFecha(){
    setInterval(()=>{
      this.fecha = new Date(Date.now());  
      this.fecha  = this.pipe.transform(this.fecha,'HH:mm:ss a');
     }, 1000)
  }

  regresar() {
    this.formAsistencia.reset();
    this.bandera = false;

    this.router.navigate(['/home']);
  }

  printCurrentPosition = async () => {
    this.cargandoUbicacion = true;
    const coordinates = await Geolocation.getCurrentPosition();
    
    this.formAsistencia.get('latitud')?.setValue(coordinates.coords.latitude);
    this.formAsistencia.get('longitud')?.setValue(coordinates.coords.longitude);

    this.init();

    let coord =  `Lat: ${coordinates.coords.latitude} Log ${coordinates.coords.longitude}`;
    this.formAsistencia.get('coordenadas')?.setValue(coord);


    this.cargandoUbicacion = false;
  };

  saveAsistencia(){
    if (this.formAsistencia.invalid) { return; }

    if (this.formAsistencia.valid) {
      const form = this.formAsistencia.value;
      
      const data = this.seteandoData(form);
      //console.log('asistencia',data);
      this.serviceAsistencia(data);
    }
  }

  seteandoData(form:any): any{
    const data = {
      asistencia: {
          user_id : this._authS.user.id,
          tipo_registro_id : form.tipo_registro_id,
          tipo_asistencia_id : form.tipo_asistencia_id
      },
      ubicacion : [
        {
          latitud: -2.162599 , //-2.162592  form.latitud
          longitud: -79.929570    //-79.929580   form.longitud
        }
      ]
    }
    return data;
  }

  serviceAsistencia(data:any){
    this._misSe.saveAsistencia(data).subscribe({
      next: (resp) => { 
        if (resp.status) {
          localStorage.setItem('tipo',JSON.stringify(data.asistencia.tipo_registro_id));
          this.formAsistencia.reset();
          this._authS.Mensaje(resp.message);
          this.bandera = false;
          this.router.navigate(['/home']);
        }else{
          this.formAsistencia.reset();
          this._authS.Mensaje(resp.message,'danger');
          this.bandera = false;
          this.router.navigate(['/home']);        
        }
      }, 
<<<<<<< HEAD
      error: (err) => { console.log(err); 
        
        
      } 
    });
  }


}
=======
      error: (err) => { console.log(err); } 
    });
  }

  async init(){
    this.googleServ.init(this.renderer, this.document).then( (resp) =>{
        this.initMap();
    }).catch( (err) => {
      console.log(err);
    });
  }

  initMap(){
    if (this.divMap == undefined) { return; }

      const dataform = this.formAsistencia.value;
      //console.log('latitud',dataform.latitud)
      //console.log('longitud',dataform.longitud)

      //const positions = { lat:-2.232425,lng:-80.900891 };
      const positions = { lat:dataform.latitud,lng:dataform.longitud };

    
      let latLng = new google.maps.LatLng(positions.lat,positions.lng); //crea una nueva posision    
      
      let mapOptions = { center: latLng, zoom: 15, disableDefaultUI:true, clickableIcons: false };
      
      this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);
      
      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        draggable: true,
      });
  }

}
>>>>>>> 3107cc3aecefb3cdba4332cf487135c40b699b5d
