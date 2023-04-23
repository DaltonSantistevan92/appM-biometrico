import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MiserviciosService } from 'src/app/pages/Mis_Servicios/miservicios.service';


@Component({
  selector: 'app-ringreso',
  templateUrl: './ringreso.page.html',
  styleUrls: ['./ringreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RIngresoPage implements OnInit {
  public data: any[] = [];
  historialForm!: FormGroup;

  listaTiposAsistencia: any[] = [];

  constructor(
    private router: Router,
    private _authS: AuthService,
    private fb: FormBuilder,
    private _misSe: MiserviciosService
  ) { }

  ngOnInit() {
    if (this._authS.user == null) { return; }
    this.initForm();
    this.getTiposAsistencia();

    //this.infoData();
  }

  initForm() {
    this.historialForm = this.fb.group({
      tipo_asistencia_id: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]]
    });
  }

  getTiposAsistencia() {
    this._misSe.getTiposAsistencias().subscribe({
      next: (resp) => { this.listaTiposAsistencia = resp.data; },
      error: (err) => { console.log(err); }
    });
  }



  infoData() {
    this.data = [
      {
        FECHA: "05-02-2023",
        HORA: "09:31:54",
        LUGAR: "santa Elena",
        TIPO: "Entrada"
      },
      {
        FECHA: "05-02-2023",
        HORA: "09:31:54",
        LUGAR: "santa Elena",
        TIPO: "Entrada"
      }]

  }

  consultar() {
    this.historialForm.markAllAsTouched();
    if (this.historialForm.invalid) { return; }

    if (this.historialForm.valid) {
      const form = this.historialForm.value;

      let dateValidator = this.dateValidator(form.fecha_inicio, form.fecha_fin);
     
      if (dateValidator) {
        this.servicioReport(form);
      }
    }
  }

  dateValidator(fecha_inicio: string, fecha_fin: string): boolean {
    if (fecha_inicio && fecha_fin) {
      const start = new Date(fecha_inicio);
      const end = new Date(fecha_fin);

      if (start > end) {
        this._authS.Mensaje('La fecha fin no puede ser menor', 'warning');
        return false;
      }
    }
    return true;
  }

  servicioReport(form: any) {
    this._misSe.getReport(this._authS.user.id,form.fecha_inicio,form.fecha_fin,form.tipo_asistencia_id).subscribe({
      next : (resp) => {
        console.log(resp);
        if (resp.status) {
          this.data = resp.data;
          this._authS.Mensaje(resp.message);
        }else{
          this._authS.Mensaje(resp.message,'danger');
        }

      },
      error : (err) => { console.log(err); }
    });
  }

  imprimir() {

  }


  regresar() {
    this.router.navigateByUrl('/home');
  }

  

  cargarUsuario() {
    

  }
}