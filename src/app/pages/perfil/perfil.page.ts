import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgxDropzoneModule]
})
export class PerfilPage implements OnInit {
  files: File[] = [];
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    
  }


  regresar() {
  
    this.router.navigate(['/home']);
  }
  
  onSelect(event:any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
