import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ToolService } from '../Mis_Servicios/tool.service';
import { MiserviciosService } from '../Mis_Servicios/miservicios.service';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.page.html',
  styleUrls: ['./contrasena.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})
export class ContrasenaPage implements OnInit {

  cambioContrasenaForm!: FormGroup;
  claveValidate:string="^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$";

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _authS: AuthService,
    private _ts: ToolService,
    private _ms: MiserviciosService
  ) { 

  }

  ngOnInit() {
    this.cambioContrasenaForm = this.fb.group({
      email: ['',],
      nuevaContrasena: ['', [Validators.required,Validators.minLength(8),Validators.pattern(this.claveValidate)]],
      confirmarNuevaContrasena: ['', [Validators.required,Validators.minLength(8),Validators.pattern(this.claveValidate)]]
    });
  }

  cargarUserContraseña() {
    if (this._authS.user == null) { return; }
    this.cambioContrasenaForm.get('email')?.setValue(this._authS.user.email);

  }

  updateContraseña(){

  }
  regresar() {
    this.router.navigate(['/home']);
  }


}