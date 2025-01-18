import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  saveObject(key: string, obj: any): any {
    const jsonString = JSON.stringify(obj);
    localStorage.setItem(key, jsonString);
  }

  getObject(key: string): any {
    const jsonString = localStorage.getItem(key) as string;
    return JSON.parse(jsonString);
  }

  removeObject(key: string): any {
    localStorage.removeItem(key);
  }
  clear() {
    localStorage.clear();
  }
}
