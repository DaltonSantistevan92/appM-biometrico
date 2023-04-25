import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MenuComponent } from '../componentes/menu/menu.component';
import { CardPage } from '../componentes/card/card.page';
import { StorageService } from '../pages/Mis_Servicios/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, CardPage, MenuComponent, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private menuController: MenuController,
    private storage: StorageService,


  ) { }

  ngOnInit(): void {
    this.menuController.enable(true);
  }

  salir() {
    this.storage.remove('biometric');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('menu');
    localStorage.removeItem('tipo');
    localStorage.removeItem('tipo_asistencia');
    this.router.navigate(['/login']);
    this.menuController.enable(false);

  }


  ir(ruta: string) {
    this.router.navigate([ruta]);
  }

}
