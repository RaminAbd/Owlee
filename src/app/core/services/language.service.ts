import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  of,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languagesDataSubject = new BehaviorSubject<any>(null);
  languagesData$ = this.languagesDataSubject.asObservable();

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
  ) {}

  setLangs(): Observable<any> {
    const enLang$ = this.getLang('en-Us');
    const kaLang$ = this.getLang('ka-Geo');
    const azLang$ = this.getLang('az-Aze');
    const ruLang$ = this.getLang('ru-Ru');
    const trLang$ = this.getLang('tr-Tr');
    return forkJoin([enLang$, kaLang$, azLang$, ruLang$, trLang$]).pipe(
      map(([enLang, kaLang, azLang, ruLang, trLang]) => {
        const data = {
          'ka-Geo': kaLang,
          'az-Aze': azLang,
          'en-Us': enLang,
          'ru-Ru': enLang,
          'tr-Tr': enLang,
        };
        this.languagesDataSubject.next(data);
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching language data', error);
        return [];
      }),
    );
  }

  getLang(langCode: string): Observable<any> {
    return this.http.get(`i18n/${langCode}.json`);
  }

  getCurrentLanguageData(): any {
    const languagesData = this.languagesDataSubject.getValue();
    if (languagesData) {
      return languagesData[this.translate.currentLang];
    } else {
      throw new Error('LanguagesData is not defined');
    }
  }

  getByKey(key: string) {
    const currentLanguageData = this.getCurrentLanguageData();
    return currentLanguageData ? currentLanguageData[key] : '';
  }
}
