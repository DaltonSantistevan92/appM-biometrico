import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-datos-t',
  templateUrl: './datos-t.page.html',
  styleUrls: ['./datos-t.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosTPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
