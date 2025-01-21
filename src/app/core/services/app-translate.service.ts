import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AppTranslateService {
  constructor(private translate: TranslateService) {}
  registerLanguages() {
    this.translate.addLangs(['ka-Geo', 'en-Us', 'az-Aze', 'ru-Ru', 'tr-Tr']);
    const langExists: boolean = !!localStorage.getItem('systemLanguage');
    if (!langExists) {
      this.translate.setDefaultLang('en-Us');
      localStorage.setItem('systemLanguage', 'en-Us');
      this.translate.use('en-Us');
    } else {
      const value: string = localStorage.getItem('systemLanguage') as string;
      this.translate.setDefaultLang(value);
      this.translate.use(value);
    }
  }
}
