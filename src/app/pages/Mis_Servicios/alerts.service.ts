import { Injectable } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { StorageService } from './storage.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private storage: StorageService,
    private faio: FingerprintAIO,
    private navCtrl: NavController,
  ) { }

  public async checkDevice() {
    try {
      const device = await Device.getInfo(); 
      
      if (device.platform != "web") {
        this.faio.isAvailable().then((result: any) => {
          this.ConfirmAIO() //Test if this phone have Biometric Hardware
          this.navCtrl.navigateForward('/asistencia/registrar');
        })
      } else {
        this.toastInfo("La biometría no está activada....!");
      }
    } catch (error) {   
      console.log('catch',error);
    }
    //this.navCtrl.navigateForward('/home', { animated: true })
  }


  public async ConfirmAIO() {//1
    const alert = await this.alertCtrl.create({
      header: 'Usar identificación',
      message: '¿Desea utilizar la autenticación biométrica para el registro de asistencia?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'primary',
          handler: async (c) => { }
        }, {
          text: 'Yes',
          handler: async (o) => {
            await this.storage.set('biometric', "true");
            this.toastInfo("Ahora puedes usar biométrico para el siguiente registro de asistencia");
          }
        }
      ]
    });

    await alert.present();
  }


  public async toastInfo(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'success',
      animated: true,
      position: 'bottom'
    });
    toast.present();
  }

  public async toastError(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: 'danger',
      animated: true,
      position: 'bottom'
    });
    toast.present();
  }
}
