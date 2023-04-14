
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { MenuComponent } from './componentes/menu/menu.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CardPage } from './componentes/card/card.page';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, NgFor, CardPage ,MenuComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  nombre : string = '';
  cargo : string = '';


  constructor(
    private _authS :AuthService,
  ) {}
  ngOnInit() {
    //console.log('login', this.menu);
    
    this.setearUsuario();
  }

  setearUsuario() {//recargue la pagina
    if (JSON.stringify(this._authS.user) == '' ) { return; }

   // console.log('user', this._authS.user);
    

    if (this._authS.user) {
      this.nombre = this._authS.user.persona.nombres;
      this.cargo = this._authS.user.rol.cargo;
    }
  }

  
}
