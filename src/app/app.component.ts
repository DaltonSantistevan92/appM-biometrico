
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { MenuComponent } from './componentes/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, NgFor, MenuComponent],
  /* schemas : [CUSTOM_ELEMENTS_SCHEMA] */
})
export class AppComponent {
  
 

  constructor() {}

  
}
