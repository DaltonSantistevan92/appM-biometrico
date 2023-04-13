import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IntTipo } from '../interfaces/misInterface';
import { MiserviciosService } from '../Mis_Servicios/miservicios.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AsistenciaPage implements OnInit {
  coords: any;
  coordinate: any;
  watchCoordinate: any;
  watchId: any;
  loading: any;

  //F
  fecha: any; 
  segundos: any;
  hora: any;
  minutos: any;


  formAsistencia!: FormGroup;

  listaTipos: IntTipo[] = []; 

  pipe = new DatePipe('en-Us');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _authS :AuthService,
    private _misSe : MiserviciosService,
    private menuController: MenuController
  ) { }

  ngOnInit(): void {
    this.menuController.enable(false);
    this.initFormAsistencia();
    this.setearEmail();
    this.selectTipos();
    this.mostrarDataHora();
    this.getCurrentCoordinate();
    this.getFecha();
    
  }

  initFormAsistencia(){
    this.formAsistencia = this.fb.group({
			email: ['', [Validators.required]],
			fecha: ['', [Validators.required]],
      tipo_registro_id : ['', [Validators.required]],
      latitud : ['', [Validators.required]],
      longitud : ['', [Validators.required]]
		});
  }

  selectTipos(){
    this._misSe.getTipos()
      .pipe( map( (resp:IntTipo[]) => {
        resp.filter( r => {
          console.log('filter',r); //1  

          let tipo = JSON.parse(localStorage.getItem('tipo')!) || '';
          console.log('localtipo',tipo);//2

          //tipo  => ''
          //r.id == 1
          if ( (tipo == '' && r.id == 1 && tipo == 1)  ||  (tipo == 2  && r.id == 1) ) {
            //console.log('local',tipo);
            this.listaTipos.push(r); 
            console.log('lista', this.listaTipos);

          }else if (r.id == 2 && tipo == 1) {
            this.listaTipos.push(r); 
            console.log('lista', this.listaTipos);
          }
          //localstrorage validar si existe en 

        });
      }))
      .subscribe({
      next: (resp) => {
         console.log(resp);   
        //this.listaTipos = resp; 
      }, 
      error: (err) => { console.log(err); }
    });
  }

 /*  getAllEstados() {
    this._vs.getEstados().pipe(map((data:IES) => { 
        data.data.filter( (x:Estados) => { 
            if (x.id_estado == 1 || x.id_estado == 2) {
                this.listaEstados.push(x);   
            }
        })
    })).subscribe({
        next: (resp) => {},
        error: (err) => { this._sns.error('Problema en listar estados'); }
    });
} */

  setearEmail(){
    if (this._authS.user == null) {  return; }
    this.formAsistencia.get('email')?.setValue(this._authS.user.email);
    this.formAsistencia.controls['email'].disable({ onlySelf: true });   
  }

  mostrarDataHora(){
    this._misSe.getDateHoras().subscribe({
      next: (resp) => {     
        this.formAsistencia.get('fecha')?.setValue(resp.fecha);
        this.formAsistencia.controls['fecha'].disable({ onlySelf: true });
      }, 
      error: (err) => { console.log(err); } 
    });
  }

  getFecha(){
    setInterval(()=>{
      this.fecha = new Date(Date.now());  
      this.fecha  = this.pipe.transform(this.fecha,'HH:mm:ss a');
     }, 1000)
  }

  regresar() {
    this.router.navigateByUrl('/login');
  }

  getCurrentCoordinate() {
    Geolocation.getCurrentPosition().then(data => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,        
      };

      this.formAsistencia.get('latitud')?.setValue(data.coords.latitude);
      this.formAsistencia.get('longitud')?.setValue(data.coords.longitude);
    }).catch(err => {
      console.error(err);
    });
  }

  saveAsistencia(){
    if (this.formAsistencia.invalid) { return; }

    if (this.formAsistencia.valid) {
      const form = this.formAsistencia.value;

      
      const data = this.seteandoData(form);
      this.serviceAsistencia(data);
      this.formAsistencia.reset();
      this.router.navigateByUrl('/home');
    }
  }

  seteandoData(form:any): any{
    const data = {
      asistencia: {
          user_id : this._authS.user.id,
          tipo_registro_id : form.tipo_registro_id
      },
      ubicacion : [
        {
          latitud: form.latitud,
          longitud: form.longitud
        }
      ]
    }
    return data;
  }

  serviceAsistencia(data:any){
    this._misSe.saveAsistencia(data).subscribe({
      next: (resp) => { 
        if (resp.status) {
          console.log(resp);
          localStorage.setItem('tipo',JSON.stringify(data.asistencia.tipo_registro_id));
        }else{
          console.log(resp);
        }
      }, 
      error: (err) => { console.log(err); } 
    });
  }
}
