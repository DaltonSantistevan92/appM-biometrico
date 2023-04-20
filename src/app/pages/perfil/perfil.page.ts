import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ToolService } from '../Mis_Servicios/tool.service';

import { MiserviciosService } from '../Mis_Servicios/miservicios.service';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, NgxDropzoneModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilPage implements OnInit {
  files: File[] = [];
  activeImage: boolean = false;
  formPerfil!: FormGroup;

  emailValidate: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  numbers: string = "^((\\+593-?)|0)?[0-9]{9}$";
  nombreValidTilde: string = "^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$";
  img: string = '';

  base64Image: string = '';
  cedulaValid: boolean = false;
  imagenDefault: string = 'user-default.jpg';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _authS: AuthService,
    private _ts: ToolService,
    private _ms: MiserviciosService
  ) { }

  ngOnInit() {
    this.initForm();
    this.cargarUser();
  }

  initForm() {
    this.formPerfil = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.nombreValidTilde), Validators.minLength(3)]],//usuario
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailValidate)]],
      cedula: ['', [Validators.required]],
      nombres: ['', [Validators.required, Validators.pattern(this.nombreValidTilde), Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.pattern(this.nombreValidTilde), Validators.minLength(3)]],
      num_celular: ['', [Validators.required, Validators.pattern(this.numbers), Validators.minLength(10), Validators.maxLength(10)]],
      direccion: [''],
      imagen: [''],
    });
  }

  cargarUser() {
    console.log(this._authS.user);
    
    if (this._authS.user == null) { return; }

    this.serviceImagen(this._authS.user.imagen!); //cargar

    this.formPerfil.get('email')?.setValue(this._authS.user.email);
    this.formPerfil.get('name')?.setValue(this._authS.user.name || '');
    this.formPerfil.get('cedula')?.setValue(this._authS.user.persona.cedula || '');
    this.formPerfil.get('nombres')?.setValue(this._authS.user.persona.nombres || '');
    this.formPerfil.get('apellidos')?.setValue(this._authS.user.persona.apellidos || '');
    this.formPerfil.get('num_celular')?.setValue(this._authS.user.persona.num_celular || '');
    this.formPerfil.get('direccion')?.setValue(this._authS.user.persona.direccion || '');
    this.formPerfil.get('imagen')?.setValue(this._authS.user.imagen || '');

    this.validCedulaRetornoEditar(this._authS.user.persona.cedula);
  }

  validCedulaRetornoEditar(cedula: string) {
    this.cedulaValid = this._ms.validateCedulaEcuatoriana(cedula!);
    if (!this.cedulaValid) {
        return this.cedulaValid;
    } else {
        return this.cedulaValid;
    };
  }

  valiteCed(event:any){
    const cedula = event.detail.value;

    this.cedulaValid = this._ms.validateCedulaEcuatoriana(cedula!);
    if (!this.cedulaValid) {
        alert('La cédula es incorrecta');
        return this.cedulaValid;
    } else {
        alert('La cédula es correcta');
        return this.cedulaValid;
    };
  }

  serviceImagen(imagen: string) {
    this._ts.mostrarArchivo('usuarios', imagen).subscribe({
      next: (blob) => { this.convertirFileReader(blob) },
      error: (err) => { console.log(err) }
    });
  }

  convertirFileReader(blob: any) {
    const reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      this.base64Image = reader.result as string;

      if (this.base64Image != '') {
        const arrayBufferFromBase64 = this.convertDataURIToBinary(this.base64Image);
        const imagemAsFile = new File([arrayBufferFromBase64], 'new-imagem', { type: 'image/png' });
        this.files.push(imagemAsFile);
        this.activeImage = true;
      }
    }
  }

  convertDataURIToBinary(dataURI: string) {//funcional 
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  actualizar() {
    if (this.formPerfil.invalid) { return; }

    if (this.formPerfil.valid) {
      const form = this.formPerfil.value;

      if (form.imagen === this.imagenDefault || form.imagen === '' ) {
        //alert('la imagen es defaul');
        const data = this.addObjeto(form);  
        this.actualizandoUser(data);
      }else{
        //alert('la imagen es nueva');
        this._ts.subirArchivo(this.files, 'img_user', 'subirArchivo').subscribe((res:any) => {
          if(res.status){  
            const data = this.addObjeto(form);
            this.actualizandoUser(data);

            const index = this.files[0].name.indexOf(data.usuario.imagen,1);
            this.files.splice(index, 1);
            this.activeImage = false;
          }
        }); 
      }
    }
  }

  addObjeto(form: any) {
    let json = {
      usuario: {
        user_id: this._authS.user.id,
        name: form.name,
        email: form.email,
        imagen: (this.activeImage) ? form.imagen : 'user-default.jpg'
      },
      persona: {
        persona_id: this._authS.user.persona.id,
        cedula : form.cedula,
        nombres: form.nombres,
        apellidos: form.apellidos,
        num_celular: form.num_celular,
        direccion: form.direccion
      }
    }
    return json;
  }

  actualizandoUser(data: any) {
    this._ms.updateUserPerfil(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formPerfil.reset();
          this.router.navigate(['/home']);

          this._authS.sendObjeUser(resp.data);
          localStorage.setItem('user', JSON.stringify(resp.data));
        }
      }
    });
  }

  regresar() {
    this.router.navigate(['/home']);
  }

  onSelect(event: any) {
    if (!this.activeImage) {
      this.files.push(...event.addedFiles);
      this.activeImage = true;
      this.formPerfil.get('imagen')?.setValue(event.addedFiles[0].name);
    } else {
      alert('Solo sube 1 imagen !!');
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.activeImage = false;
    this.formPerfil.get('imagen')?.setValue('');
  }


  validarNumero(e: any) {
    return this._authS.validateNumber(e);
  }

  validarLetras(e: any) {
    return this._authS.validateLetters(e);
  }

}
