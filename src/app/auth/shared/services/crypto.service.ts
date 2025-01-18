import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }
  encrypt(text:any, shift:any) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        charCode = ((charCode - 65 + shift) % 26) + 65;
      } else if (charCode >= 97 && charCode <= 122) {
        charCode = ((charCode - 97 + shift) % 26) + 97;
      }
      result += String.fromCharCode(charCode);
    }
    return result;
  }
  decrypt(text:any, shift:any) {
    return this.encrypt(text, 26 - shift);
  }
}
