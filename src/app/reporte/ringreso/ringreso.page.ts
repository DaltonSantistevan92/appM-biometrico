import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ringreso',
  templateUrl: './ringreso.page.html',
  styleUrls: ['./ringreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RIngresoPage implements OnInit {
  public data:any[]=[];
  constructor(private router: Router) { }

  ngOnInit() {
    this.infoData();
    console.log(this.data)
  }

  infoData(){
    this.data= [
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
      }
  ]
  console.log(this.data)
  }


  regresar() {
    this.router.navigateByUrl('/home');
  }
}
