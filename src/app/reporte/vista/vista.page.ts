import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.page.html',
  styleUrls: ['./vista.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VistaPage implements OnInit {
  objetoConsumo: any;
  constructor( private nav: NavParams) {
    this.objetoConsumo = this.nav.get('objClieConsumo');
    console.log(this.objetoConsumo);
   }

  ngOnInit() {
  }

}
