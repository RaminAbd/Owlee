import {Component, inject, Input} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    TranslatePipe,
    NgIf,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private translate:TranslateService = inject(TranslateService);
  @Input() pageTitle: string = 'Owlee';
  langOpen: boolean = false;
  selectedLang: string = 'en-Us';
  langsToShow: any[] = [];
  langs = [
    { name: 'Georgian', value: 'ka-Geo' },
    { name: 'English', value: 'en-Us' },
    { name: 'Azerbaijani', value: 'az-Aze' },
  ];
  constructor() {
    this.selectedLang = this.translate.currentLang;
    console.log()
    this.setLangsToShow();
  }

  setLangsToShow() {
    this.langsToShow = this.langs.filter((x) => x.value !== this.selectedLang);
  }

  selectLang(lang: string) {
    this.selectedLang = lang;
    localStorage.setItem('systemLanguage', lang);
    this.translate.use(lang);
    this.setLangsToShow();
  }
}
