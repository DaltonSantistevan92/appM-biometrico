
import { Component, OnInit, ViewChild,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams,ModalController } from '@ionic/angular';
import { Asistencia } from '../interfaces/reporteAdmin-interface';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.page.html',
  styleUrls: ['./vista.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VistaPage implements OnInit {
  dataAsistencia: Asistencia;
  evento : string = '';
  departamento : string = '';
  asist : boolean = false;
  even : boolean = false;


  constructor( private nav: NavParams,private modalCtrl:ModalController,) {
    this.dataAsistencia = this.nav.get('data');
    
    this.pintarTipoAsistencia(this.dataAsistencia);
   }

  ngOnInit() {
  }



  pintarTipoAsistencia(asistencia : Asistencia){
    if (asistencia.tipo_asistencia_id == 1) {//asistencia
      console.log('asistencia',asistencia);

      this.asist = true;
      this.even = false;
      asistencia.asistencias_departamento?.forEach( (item) => {
        this.departamento = item.departamento.nombre;
      })
    }else {//evento
      this.asist = false;
      this.even = true;
      console.log('evento',asistencia);


      asistencia.asistencia_evento?.forEach( (item) => {
         this.evento = item.evento.nombre; 
      });
    }
  }


  cerraModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
prueba(){
  
}
}
