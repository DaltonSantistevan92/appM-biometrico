import { Component, OnInit, NgZone, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MiserviciosService } from '../Mis_Servicios/miservicios.service';
import { ITA, IntTipo } from '../interfaces/misInterface';
import { map, interval, tap, takeUntil, Subject, take } from 'rxjs';
import { GoogleMapService } from '../Mis_Servicios/google-map.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AlertsService } from '../Mis_Servicios/alerts.service';
import { StorageService } from '../Mis_Servicios/storage.service';


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

  pipe = new DatePipe('en-Us');

  bandera: boolean = false;
  banderaUbicacion: boolean = false;
  cargandoUbicacion: boolean = false;
  existeNombreEvento: boolean = false;
  existeTipo: boolean = false;

  //mapa
  map: any; marker: any; infowindow: any; positionSet: any;

  @ViewChild('map') divMap!: ElementRef; //obtener el elemnt de la vista #map

  label = { titulo: 'Ubicación', subtitulo: 'ubicación de la empresa' };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _authS: AuthService,
    private _misSe: MiserviciosService,
    private menuController: MenuController,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private googleServ: GoogleMapService,
    private alerts: AlertsService,
    private storage: StorageService,
    private faio: FingerprintAIO,
  ) { }

  ngOnInit(): void {
    if (this._authS.user == null) { return; }
    this.menuController.enable(true);
    this.initFormAsistencia();
    //this.onValueChanges();
  }

  ionViewWillEnter() {
    this.unLock();
  }

  async unLock() {
    let Biometric = await this.storage.get('biometric');
    console.log(Biometric);

    if (Biometric != null) {//automatico
      this.traerTipoAsistenciaBd();
      this.traerTipoBd();
      this.getTiposAsistencia();

      this.fingerPrintAIO();
    } else {//manual
      //this.alerts.ConfirmAIO();
      this.alerts.checkDevice();

      this.traerTipoAsistenciaBd();
      this.traerTipoBd();
      this.getTiposAsistencia();
    }
  }

  fingerPrintAIO() {
    this.faio.isAvailable().then((result: any) => {
      this.faio.show({
        title: 'Autenticación biométrica',
        subtitle: 'Por favor conectarse',
        disableBackup: true,
      }).then((res: any) => {
        //this.alerts.toastInfo("La asistencia se registro correctamente :) ");
        //programar el automatico de registar x un evento
        this.saveAsistencia();

        //this.navCtrl.navigateForward('/home', { animated: true });
        return true
      }).catch((error: any) => {
        this.alerts.toastError(error.message);
        this.storage.remove('biometric');
        this.router.navigate(['/home']);
        return false
      })
    }).catch((error: any) => {
      this.alerts.toastError("Este teléfono no tiene hardware biométrico o está desactivado, verifíquelo")
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }


  initFormAsistencia() {
    this.formAsistencia = this.fb.group({
      email: ['', [Validators.required]],
      fecha: [''],
      tipo_registro_id: [''],
      tipo_asistencia_id: ['', [Validators.required]],
      tipo_registro: [''],//solo pintar
      tipo_asistencia: [''],//solo pintar
      latitud: [''],
      longitud: [''],
      coordenadas: [''],
      nombre_evento: ['']
    });
  }

  /* onValueChanges(): void {
    this.formAsistencia.valueChanges.subscribe(val => {
      console.log('value', val.tipo_asistencia_id);
    });
  } */

  traerTipoBd() {
    this._misSe.getUltimoTipo(this._authS.user.id).subscribe((resp) => {
      localStorage.setItem('tipo', JSON.stringify(resp))
    });
  }

  traerTipoAsistenciaBd() {
    this._misSe.getUltimoTipoAsistencia(this._authS.user.id).subscribe({
      next: (resp) => {
        if (resp.status) {
          if (resp.data) {//por evento
            this.formAsistencia.get('nombre_evento')?.setValue(resp.data.nombre.toUpperCase());
          }
          localStorage.setItem('tipo_asistencia', JSON.stringify(resp.tipo_asistencia_id));
        } else {
          localStorage.setItem('tipo_asistencia', JSON.stringify(resp.tipo_asistencia_id));
        }
      },
    });
  }

  getTiposAsistencia() {
    this._misSe.getTiposAsistencias()
      .pipe(map((resp: ITA) => {
        resp.data.filter(f => {
          let tipo_asistencia = JSON.parse(localStorage.getItem('tipo_asistencia')!) || '';

          if (tipo_asistencia == 1 && f.id == 1) {
            this.existeTipo = true;
            this.formAsistencia.get('tipo_asistencia_id')?.setValue(f.id);
            this.formAsistencia.get('tipo_asistencia')?.setValue(f.type);
            this.bandera = true;
            this.banderaUbicacion = true;
            this.setearEmail();
            this.selectTipos();
            this.getFecha();
            this.printCurrentPosition();
          } else if (tipo_asistencia == 2 && f.id == 2) {
            this.existeTipo = true;
            this.formAsistencia.get('tipo_asistencia_id')?.setValue(f.id);
            this.formAsistencia.get('tipo_asistencia')?.setValue(f.type);
            this.bandera = true;
            this.existeNombreEvento = true;
            this.banderaUbicacion = false;
            this.setearEmail();
            this.selectTipos();
            this.getFecha();
          }
        });
      })
      )
      .subscribe({
        next: (resp) => { },
        error: (err) => { console.log(err); }
      });
  }

  selectTipos() {//entrada y salida
    this._misSe.getTipos()
      .pipe(map((resp: IntTipo[]) => {
        resp.filter(r => {
          let tipo = JSON.parse(localStorage.getItem('tipo')!) || '';

          if ((tipo == '' && r.id == 1) || (tipo == 2 && r.id == 1) || (tipo == 1 && r.id == 2)) {
            this.formAsistencia.get('tipo_registro_id')?.setValue(r.id);
            this.formAsistencia.get('tipo_registro')?.setValue(r.tipo);
          } else if (r.id == 2 && tipo == 1) {
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

  setearEmail() {
    if (this._authS.user == null) { return; }
    this.formAsistencia.get('email')?.setValue(this._authS.user.email);

    this.fecha = new Date(Date.now());
    this.fecha = this.pipe.transform(this.fecha, 'dd/MM/yyyy');

    const [day, month, year] = this.fecha.split('/');
    const newFechaInicio = `${year}-${month}-${day}`;

    this.formAsistencia.get('fecha')?.setValue(newFechaInicio);
  }

  getFecha() {
    setInterval(() => {
      this.fecha = new Date(Date.now());
      this.fecha = this.pipe.transform(this.fecha, 'HH:mm:ss a');
    }, 1000)
  }

  regresar() {
    //this.formAsistencia.reset();
    this.existeTipo = false;
    this.bandera = false;
    this.banderaUbicacion = false;
    this.router.navigate(['/home']);
  }

  printCurrentPosition = async () => {
    this.cargandoUbicacion = true;
    const coordinates = await Geolocation.getCurrentPosition();

    this.formAsistencia.get('latitud')?.setValue(coordinates.coords.latitude);
    this.formAsistencia.get('longitud')?.setValue(coordinates.coords.longitude);

    this.init();

    let coord = `Lat: ${coordinates.coords.latitude} Lon: ${coordinates.coords.longitude}`;
    this.formAsistencia.get('coordenadas')?.setValue(coord);

    this.cargandoUbicacion = false;
  };

  saveAsistencia() {
    if (this.formAsistencia.invalid) { return; }

    if (this.formAsistencia.valid) {
      const form = this.formAsistencia.value;

      const data = this.seteandoData(form);
      this.serviceAsistencia(data);
    }
  }

  seteandoData(form: any): any {
    const data = {
      asistencia: {
        user_id: this._authS.user.id,
        tipo_registro_id: form.tipo_registro_id,
        tipo_asistencia_id: form.tipo_asistencia_id
      },
      ubicacion: [
        {
          latitud: -2.232822, //-2.162592  form.latitud  -2.232822
          longitud: -80.879130   //-79.929580   form.longitud   -80.879130 
        }
      ]
    }
    return data;
  }

  serviceAsistencia(data: any) {
    this._misSe.saveAsistencia(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          localStorage.setItem('tipo', JSON.stringify(data.asistencia.tipo_registro_id));
          localStorage.setItem('tipo_asistencia', JSON.stringify(data.asistencia.tipo_asistencia_id));

          this.formAsistencia.reset();
          this._authS.Mensaje(resp.message);
          this.existeTipo = false;
          this.bandera = false;
          this.router.navigate(['/home']);
        } else {
          this.formAsistencia.reset();
          this._authS.Mensaje(resp.message, 'danger');
          this.bandera = false;
          this.router.navigate(['/home']);
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  async init() {
    this.googleServ.init(this.renderer, this.document).then((resp) => {
      console.log('googleService', resp);
      this.initMap();
    }).catch((err) => {
      console.log(err);
    });
  }

  initMap() {
    if (this.divMap == undefined) { return; }

    const dataform = this.formAsistencia.value;

    const positions = { lat: dataform.latitud, lng: dataform.longitud };

    let latLng = new google.maps.LatLng(positions.lat, positions.lng); //crea una nueva posision    

    let mapOptions = { center: latLng, zoom: 15, disableDefaultUI: true, clickableIcons: false };

    this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
    });

    this.addMarker(positions);
  }

  addMarker(positions: any): void {
    let latLng = new google.maps.LatLng(positions.lat, positions.lng);
    this.marker.setPosition(latLng); //muestra el marcador
    this.map.panTo(positions);//centrar el marker 
    this.positionSet = positions;
  }

}