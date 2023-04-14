import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MiserviciosService } from '../Mis_Servicios/miservicios.service';
import { IntTipo } from '../interfaces/misInterface';
import { map } from 'rxjs';


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
  pipe = new DatePipe('en-Us');


  cargandoUbicacion: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _authS :AuthService,
    private _misSe : MiserviciosService,
    private menuController: MenuController,
    
  ) { }

  ngOnInit(): void {
    this.menuController.enable(true);
    this.initFormAsistencia();
    this.setearEmail();
    this.traerTipo();

    this.selectTipos();
    this.getFecha();    
    this.printCurrentPosition();

  }

  initFormAsistencia(){
    this.formAsistencia = this.fb.group({
			email: ['', [Validators.required]],
			fecha: ['', [Validators.required]],
      tipo_registro_id : ['', [Validators.required]],
      latitud : ['', [Validators.required]],
      longitud : ['', [Validators.required]],
      coordenadas : ['', [Validators.required]]
		});
  }

  traerTipo(){
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
            this.listaTipos.push(r); 
          }else if (r.id == 2 && tipo == 1) {
            this.listaTipos.push(r);
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
    this.router.navigateByUrl('/login');
  }

  printCurrentPosition = async () => {
    this.cargandoUbicacion = true;
    const coordinates = await Geolocation.getCurrentPosition();
    
    this.formAsistencia.get('latitud')?.setValue(coordinates.coords.latitude);
    this.formAsistencia.get('longitud')?.setValue(coordinates.coords.longitude);

    let coord =  `Lat: ${coordinates.coords.latitude} Log ${coordinates.coords.longitude}`;
    this.formAsistencia.get('coordenadas')?.setValue(coord);
    this.cargandoUbicacion = false;
  };

  saveAsistencia(){
    if (this.formAsistencia.invalid) { return; }

    if (this.formAsistencia.valid) {
      const form = this.formAsistencia.value;

      const data = this.seteandoData(form);
      this.serviceAsistencia(data);
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
          localStorage.setItem('tipo',JSON.stringify(data.asistencia.tipo_registro_id));
          this.formAsistencia.reset();
          this._authS.Mensaje(resp.message);
          this.router.navigate(['/home']);
        }else{
          this._authS.Mensaje(resp.message,'danger');        
        }
      }, 
      error: (err) => { console.log(err); 
        
      } 
    });
  }

}
