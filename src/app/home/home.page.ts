import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuComponent } from '../componentes/menu/menu.component';
import { CardPage } from '../componentes/card/card.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, CardPage, MenuComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomePage implements OnInit {

  constructor(
   private router: Router,
   private menuController: MenuController,

  ) {}

  ngOnInit(): void {
    this.menuController.enable(true);
  }

  salir(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('menu');
    localStorage.removeItem('tipo');
    this.router.navigate(['/login']);
  }

  

  


}
