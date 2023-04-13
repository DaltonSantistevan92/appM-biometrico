import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Formulario, RegIntTrabajador } from '../interfaces/registro.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegistroPage implements OnInit {

  public formuRT!: FormGroup;
  emailValidate: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor(
    private _builder: FormBuilder,
    private _auSer: AuthService,
    private router: Router,
    private menuController: MenuController) { }

  ngOnInit() {
    this.menuController.enable(false);
    this.validarFrmulario();
    this.menuController.enable(false);
  }

  validarFrmulario() {
    this.formuRT = this._builder.group({
      nombres: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email, Validators.pattern(this.emailValidate)]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    })
  }

  guardarTrabajador() {
    if (this.formuRT.invalid) { return; }

    if (this.formuRT.valid) {
      const formul: Formulario = this.formuRT.value;
      const data = this.armarJson(formul);

      this.registrarTrabajador(data);
    }
  }

  registrarTrabajador(data: RegIntTrabajador) {
    this._auSer.saveTrabajador(data).subscribe({
      next: (resp) => { 
        if (resp.status) {
          this._auSer.Mensaje(resp.message);
        }else{
          this._auSer.Mensaje(resp.message,'danger');
        }
      },
      error: (err) => { console.log(err); },
      complete: () => {  this.router.navigateByUrl('/login');}
    });
  }


  armarJson(form: Formulario): RegIntTrabajador {
    let registro: RegIntTrabajador = {
      persona: { nombres: form.nombres },
      usuario: { email: form.email, password: form.password }
    }
    return registro;
  }

  regresar() {
    this.router.navigateByUrl('/login');
  }



}
