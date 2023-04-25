import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public async set(key:any, value:any) {
    return await Preferences.set({ key, value })
      .then(value => {
        return true
      })
      .catch(error => {
        return false
      });
  }

  public async get(key:any) {
    return await Preferences.get({ key })
      .then((data:any) => {
        return JSON.parse(data.value)
      })
      .catch(error => {
        return error
      });
  }

  public async remove(key:any) {
    return await Preferences.remove({ key })
      .then(value => {
        return true
      })
      .catch(error => {
        return false
      });
  }
}
