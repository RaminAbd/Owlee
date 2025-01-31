import { Component, inject, Input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe, NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private titleService: Title = inject(Title);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private translate: TranslateService = inject(TranslateService);
  pageTitle: string = 'Owlee';
  @Input() personalInfoURL: string;
  langOpen: boolean = false;
  selectedLang: string = 'en-Us';
  langsToShow: any[] = [];
  langs = [
    { name: 'Georgian', value: 'ka-Geo' },
    { name: 'English', value: 'en-Us' },
    { name: 'Azerbaijani', value: 'az-Aze' },
    { name: 'Russian', value: 'ru-Ru' },
    { name: 'Turkish', value: 'tr-Tr' },
  ];
  constructor() {
    this.selectedLang = this.translate.currentLang;
    console.log();
    this.setLangsToShow();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => {
        const title = data['title'] || 'Default Title';
        this.pageTitle = title;
        this.titleService.setTitle(title);
      });
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
