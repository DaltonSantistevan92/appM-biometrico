import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, MenuController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Formulario } from '../interfaces/registro.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]

})
export class LoginPage implements OnInit {

  formLogin!: FormGroup;
  emailValidate: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  hide = true;


  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private router : Router,
    private _auSer: AuthService,
    private menuController: MenuController) {}

  ngOnInit(): void {
    this.menuController.enable(false);
    this.initForm();
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
      this.loginAcceso(form);
      await loading.dismiss();
    }
  }

  loginAcceso(data: Formulario){
    this._auSer.login(data).subscribe({
      next: (resp) => { 
        if (resp.status === true) {
          this.formLogin.reset();
          this._auSer.Mensaje(resp.message);
          this.router.navigate(['/home']);
        }else{
          this._auSer.Mensaje(resp.message,'danger');
          this.formLogin.reset();
        }
      }, 
      error: (err) => { console.log(err); }
    });  

  }


 
}
