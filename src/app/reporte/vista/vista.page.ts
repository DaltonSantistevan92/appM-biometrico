import { TipoAsistencia } from './../../pages/interfaces/misInterface';
import { Component, ElementRef, OnInit, Renderer2, ViewChild,Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMapService } from 'src/app/pages/Mis_Servicios/google-map.service';
import { map, interval, tap, takeUntil, Subject, take } from 'rxjs';
declare var google: any;

@Component({
  selector: 'app-vista',
  templateUrl: './vista.page.html',
  styleUrls: ['./vista.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})
export class VistaPage implements OnInit {
  data: any;
  //mapa
  map: any; marker: any; infowindow: any; positionSet: any;

  @ViewChild('map') divMap!: ElementRef; //obtener el elemnt de la vista #map

  label = { titulo: 'Ubicación', subtitulo: 'ubicación de la empresa' };
  
  constructor( private nav: NavParams, private googleServ: GoogleMapService,
    @Inject(DOCUMENT) private document: Document,   private fb: FormBuilder,
    private renderer: Renderer2,) {
    this.data = this.nav.get('data');
     console.log(this.data);
   }

  ngOnInit() {
    
  }

 

  
}
