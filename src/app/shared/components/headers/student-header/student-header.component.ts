import { Component, inject, Input } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { AuthService } from '../../../../auth/sign-in/auth.service';
import { filter, map, mergeMap } from 'rxjs';
import { StudentNavigationBarComponent } from '../../navigation-bars/student-navigation-bar/student-navigation-bar.component';
import {InvitationsService} from "../../../../pages/invitations/invitations.service";
import {Notifications} from "../../header/shared/components/notifications/notifications";
import {StudentHeaderService} from './student-header.service';
import {NotificationsResponseModel} from '../../../../core/models/notifications-response.model';

@Component({
  selector: 'app-student-header',
    imports: [
        NgForOf,
        NgIf,
        RouterLink,
        TranslatePipe,
        NgClass,
        RouterLinkActive,
        Notifications,
    ],
  templateUrl: './student-header.component.html',
  styleUrl: './student-header.component.scss',
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
export class StudentHeaderComponent {
  private service: StudentHeaderService = inject(StudentHeaderService);
  private titleService: Title = inject(Title);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private translate: TranslateService = inject(TranslateService);
  pageTitle: string = 'Owlee';
  isHidden = false;
  links: any[] = new StudentNavigationBarComponent().links;
  personalInfoURL: string = '/main/student/personal-info';
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
  invitations:any[]=[]

  constructor(
    private sanitizer: DomSanitizer,
    private signInService: AuthService,
    private invitationService:InvitationsService
  ) {
    this.service.component = this;
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

    this.invitationService.getAllInvitations().subscribe((resp) => {
      this.invitations = resp.data;
    });

    this.invitationService.invitationsUpdated.subscribe(() => {
      this.invitationService.getAllInvitations().subscribe((resp) => {
        this.invitations = resp.data;
      });
    })
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
    if (this.showMenu) {
      questPages.classList.add('active');
    } else {
      questPages.classList.remove('active');
    }
  }

  closeBurger() {
    this.showMenu = false;
    var questPages = document.querySelector('.burger') as Element;
    questPages.classList.remove('active');
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onAnimationDone() {
    if (!this.showMenu) {
      this.isHidden = true;
    }
  }

  logout() {
    this.signInService.logout();
    this.router.navigate(['/']);
  }
}
