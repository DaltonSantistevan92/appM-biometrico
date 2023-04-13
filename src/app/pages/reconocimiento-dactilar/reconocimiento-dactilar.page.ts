import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-reconocimiento-dactilar',
  templateUrl: './reconocimiento-dactilar.page.html',
  styleUrls: ['./reconocimiento-dactilar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ReconocimientoDactilarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
