import { Component, ElementRef, OnInit, ViewChild,ContentChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule,IonInput  } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ToolService } from '../Mis_Servicios/tool.service';
import { MiserviciosService } from '../Mis_Servicios/miservicios.service';


@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.page.html',
  styleUrls: ['./contrasena.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
  export class ContrasenaPage implements OnInit {
//@ViewChild('passwordEyeRegister') passwordEye;

    hide = true;
    hideConf = true;

    cambioContrasenaForm!: FormGroup;


    constructor(
      private router: Router,
      private fb: FormBuilder,
      private _authS: AuthService,
      private _ts: ToolService,
      private _ms: MiserviciosService
    ) {

    }

    ngOnInit() {
      this.initForm();
      this.cargarUser();
    }

    initForm() {
      this.cambioContrasenaForm = this.fb.group({
        email: ['', [Validators.required]],
        nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmar: ['', [Validators.required, Validators.minLength(6)]]
      });
    }

    cargarUser() {
      if (this._authS.user == null) { return; }
      this.cambioContrasenaForm.get('email')?.setValue(this._authS.user.email);
    }

    update() {
      if (this.cambioContrasenaForm.invalid) { return; }

      if (this.cambioContrasenaForm.valid) {

        const form = this.cambioContrasenaForm.value;

        if (form.nuevaContrasena === form.confirmar) {
          const data = this.armarObje(form);
          this.serviceUpdatePass(data);
        } else {
          this._authS.Mensaje('Las contraseñas no coiciden', 'danger');
        }
      }
    }

    armarObje(form: any) {
      let json = {
        usuario: {
          user_id: this._authS.user.id,
          password: form.nuevaContrasena
        }
      }
      return json;
    }

    serviceUpdatePass(data: any) {
      this._ms.updatePassword(data).subscribe({
        next: (resp) => {
          if (resp.status) {
            this._authS.Mensaje(resp.message);
            this.cambioContrasenaForm.reset();
            this.router.navigate(['/home']);
          } else {
            this._authS.Mensaje(resp.message, 'danger');
          }
        },
        error: (err) => { console.log(err) }
      });
    }

    regresar() {
      this.router.navigate(['/home']);
    }


  }