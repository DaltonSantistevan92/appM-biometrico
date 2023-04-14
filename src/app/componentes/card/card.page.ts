import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RouterLink } from '@angular/router';
import { User } from 'src/app/auth/interfaces/auth.interface';


@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink,FormsModule],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardPage implements OnInit {

  nombre : string = '';
  cargo : string = '';

  constructor( private _authS :AuthService) { }

  ngOnInit() {
    this._authS.$getObjSourceUser.subscribe((resp: any) => {
      if (resp instanceof Object) {
        let objvacio = Object.keys(resp).length === 0;

        if (objvacio == true) {//vacio tu recargar la paginas y se setea del localstorage
          let localUser : User = JSON.parse(localStorage.getItem('user')!) || null;

          if (localUser != null) {
            this.nombre = localUser.persona.nombres;
            this.cargo = localUser.rol.cargo; 
          }
        }else{//lleno 
          this.nombre = resp.persona.nombres;
          this.cargo = resp.rol.cargo; 
        }
      } else {
        console.log("myObservable no es de tipo objeto", resp);
      }
    });
  }

}
