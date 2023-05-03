import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MiserviciosService } from 'src/app/pages/Mis_Servicios/miservicios.service';
import { VistaPage } from '../vista/vista.page';
import * as html2pdf from 'html2pdf.js'

/////
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Asistencia } from '../interfaces/reporteAdmin-interface';
/////

@Component({
  selector: 'app-ringreso',
  templateUrl: './ringreso.page.html',
  styleUrls: ['./ringreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
//@ViewChild('elementToPrint', {static: false}) elementToPrint: ElementRef;
export class RIngresoPage implements OnInit {
  [x: string]: any;
  currentDate: Date = new Date();
  @ViewChild('pdfContent', {static: false}) pdfContent?: ElementRef; 

  public data: any[] = [];
  public dataSuperAdmin: any[] = [];
  public datosPersonales: any;

  historialForm!: FormGroup;

  listaTiposAsistencia: any[] = [];

  sortDirecion = 0;
  sortKey = null;

  band = false;

  bandAdmin = false;
  bandBtnReporte = false;

  //private file!:File

  constructor(
    private router: Router,
    private _authS: AuthService,
    private fb: FormBuilder,
    private _misSe: MiserviciosService,
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    if (this._authS.user == null) { return; }
    this.initForm();
    this.getTiposAsistencia();

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
      next: (resp) => {
        console.log(resp);

        this.listaTiposAsistencia = resp.data;
      },
      error: (err) => { console.log(err); }
    });
  }


  sortBy(key: any) {
    this.sortKey = key;
    this.sortDirecion++;
    this.sort();
  }

  sort() {
    if (this.sortDirecion == 1) {
      this.data = this.data.sort((a, b): any => {
        const valA = a[this.sortKey!];
        const valB = b[this.sortKey!];
        return valA.localeCompare(valB);
      });
    } else if (this.sortDirecion == 2) {
      this.data = this.data.sort((a, b): any => {
        const valA = a[this.sortKey!];
        const valB = b[this.sortKey!];
        return valB.localeCompare(valA);
      });
    } else {
      this.sortDirecion = 0;
      this.sortKey = null;
    }
  }

  consultar() {
    this.historialForm.markAllAsTouched();
    if (this.historialForm.invalid) { return; }

    if (this.historialForm.valid) {
      const form = this.historialForm.value;

      let dateValidator = this.dateValidator(form.fecha_inicio, form.fecha_fin);

      if (dateValidator) {
        if (this._authS.user.rol_id == 1 || this._authS.user.rol_id == 2) {// superadmin y adminnistrador
          this.servicioReportAdmin(form);
        } else if (this._authS.user.rol_id == 4) {
          const data = { ...form, user_id: this._authS.user.id }
          this.servicioReportTrabajador(data);
        }
      } else {
        this.band = false;
        this.bandAdmin = false;
        this.bandBtnReporte = false;
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

  servicioReportAdmin(form: any) {
    this._misSe.getReportSuperAdmin(form.fecha_inicio, form.fecha_fin, form.tipo_asistencia_id).subscribe({
      next: (resp) => {
        console.log("Response: ", resp);

        if (resp.status) {
          this.bandAdmin = true;
          this.band = false;
          this.bandBtnReporte = true;
          this.dataSuperAdmin = resp.data;
          this._authS.Mensaje(resp.message);
          this.historialForm.reset();
        } else {
          this.bandAdmin = false;
          this.bandBtnReporte = false;
          this._authS.Mensaje(resp.message, 'danger');
          this.historialForm.reset();
        }
      },
      error: (err) => { console.log(err); }
    })
  }

  servicioReportTrabajador(form: any) {
    this._misSe.getReport(form.user_id, form.fecha_inicio, form.fecha_fin, form.tipo_asistencia_id).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.band = true;
          this.bandBtnReporte = true;
          this.data = resp.data;
          this.datosPersonales = resp.datos_personales.user;
          console.log(this.datosPersonales);//undef
          this.sort();
          this._authS.Mensaje(resp.message);
          this.historialForm.reset();
        } else {
          this.band = false;
          this.bandBtnReporte = false;
          this._authS.Mensaje(resp.message, 'danger');
          this.historialForm.reset();
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  imprimir() {
   if (this._authS.user.rol_id == 1 || this._authS.user.rol_id == 2) {// superadmin y adminnistrador
      console.log('admin', this._authS.user.rol_id);


      
      var element = document.getElementById('pdfContainer');

      let opt = {
        margin: 0.5,
        filename: 'Reporte.pdf',
        image: { type: 'jpeg', quality: 3 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'ledger', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();

    } else {
      console.log('trabajador', this._authS.user.rol_id);
   
      var element = document.getElementById('pdfContainer');



      let opt = {
        margin: 0.5,
        filename: 'Reporte.pdf',
        image: { type: 'jpeg', quality: 3 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'ledger', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();

    } 


  }


  regresar() {
    this.router.navigateByUrl('/home');
  }



  cargarUsuario() {

  }

  async modal(items: Asistencia){
    let modal = await this.modalCtrl.create({
      component: VistaPage,
      cssClass: 'cart-modal',
      componentProps: { data: items}
    });
    modal.present();
  }


}
