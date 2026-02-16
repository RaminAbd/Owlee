import {Component, inject, Input, OnInit} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '../../../../../auth/sign-in/auth.service';
import { filter, map, mergeMap } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { StorageService } from '../../../../../core/services/storage.service';

@Component({
  selector: 'app-home-header',
  imports: [NgIf, TranslatePipe, RouterLink, NgClass, RouterLinkActive],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss',
  animations: [
    trigger('menuExpand', [
      state(
        'open',
        style({
          width: '*',
          visibility: 'visible',
          display: 'block',
        }),
      ),
      state(
        'closed',
        style({
          width: '0px',
          visibility: 'hidden',
        }),
      ),
      transition('open <=> closed', [animate('500ms ease-in-out')]),
    ]),
  ],
})
export class HomeHeaderComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private storage: StorageService = inject(StorageService);
  private titleService: Title = inject(Title);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private translate: TranslateService = inject(TranslateService);
  pageTitle: string = 'Owlee';
  langOpen: boolean = false;
  selectedLang: string = 'en-Us';
  langsToShow: any[] = [];
  isHidden = false;
  langs = [
    { name: 'Georgian', value: 'ka-Geo' },
    { name: 'English', value: 'en-Us' },
    { name: 'Azerbaijani', value: 'az-Aze' },
    { name: 'Russian', value: 'ru-Ru' },
    { name: 'Turkish', value: 'tr-Tr' },
  ];
  userId:string = localStorage.getItem('userId') as string;
  constructor(
    private sanitizer: DomSanitizer,
    private signInService: AuthService,
    private route: ActivatedRoute
  ) {
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

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const sectionId = this.route.snapshot.queryParamMap.get('scrollTo');
        if (sectionId) {
          this.scrollToElement(sectionId);
        }
      });
  }

  navigateAndScroll(sectionId: string): void {
    const isHome = this.router.url.split('?')[0] === '/home';

    if (isHome) {
      this.scrollToElement(sectionId);
    } else {
      this.router.navigate(['/home'], {
        queryParams: { scrollTo: sectionId }
      });
    }
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const headerOffset = 80; // adjust to your header height
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
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

  showMenu: boolean = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
    var questPages = document.querySelector('.burger') as Element;
    var body = document.querySelector('body') as Element;
    if (this.showMenu) {
      questPages.classList.add('active');
      body.classList.add('blocked');
    } else {
      questPages.classList.remove('active');
      body.classList.remove('blocked');
    }
  }

  closeBurger() {
    this.showMenu = false;
    var questPages = document.querySelector('.burger') as Element;
    var body = document.querySelector('body') as Element;
    questPages.classList.remove('active');
    body.classList.remove('blocked');
  }

  onAnimationDone() {
    if (!this.showMenu) {
      this.isHidden = true;
    }
  }

  signin() {
    let ar = this.storage.getObject('authResponse');
    console.log(ar);
    if (ar) {
      this.authService.navigateByRole(ar);
    }
    else{
      this.router.navigate(['/auth']);
    }
  }

  // navigateAndScroll(sectionId: string): void {
  //   this.router
  //     .navigate(['/home'], { queryParams: { scrollTo: sectionId } })
  //     .then(() => {
  //       this.scrollToElement(sectionId);
  //     });
  // }
  //
  // scrollToElement(elementId: string): void {
  //   const checkInterval = 100;
  //   const maxAttempts = 10;
  //   let attempts = 0;
  //
  //   const interval = setInterval(() => {
  //     const element = document.getElementById(elementId);
  //     if (element) {
  //       clearInterval(interval);
  //       setTimeout(() => {
  //         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //       }, 0);
  //     } else {
  //       attempts++;
  //       if (attempts >= maxAttempts) {
  //         clearInterval(interval);
  //         console.warn(`Element with ID "${elementId}" not found.`);
  //       }
  //     }
  //   }, checkInterval);
  // }
}
