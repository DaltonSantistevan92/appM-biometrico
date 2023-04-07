import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Formulario } from '../interfaces/registro.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  formLogin!: FormGroup;
  emailValidate: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private router : Router,
    private _auSer: AuthService,
    private menuController: MenuController

  ) {}

  ngOnInit(): void {
    this.initForm();
    this.menuController.enable(false);
  }

  initForm(){
    this.formLogin = this.fb.group({
			email: ['', [Validators.required, Validators.email,  Validators.pattern(this.emailValidate)]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
  }

  async login(){
    if (this.formLogin.invalid) { return; }

    if (this.formLogin.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      const form : Formulario = this.formLogin.value; 

      this.loginAcceso(form)
      await loading.dismiss();
    }
  }

  loginAcceso(data: Formulario){
    this._auSer.login(data).subscribe({
      next: (resp) => { 
        console.log(resp);
        if (resp.status) {
          this.router.navigateByUrl('/home');
          this._auSer.Mensaje(resp.message);
        }
      }, 
      error: (err) => { 
        console.log(err);
        this._auSer.Mensaje(err.error.message,'danger');
      }
    });  

  }

  crearCuenta(){
    this.router.navigateByUrl('/registro');
  }

 
}
