import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, Input, AfterViewInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, NgFor],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuComponent implements OnInit {


  get menu(): any {//getter para menú nos devuelve un array del auth service
    return this.auth.menu;
  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  


}
