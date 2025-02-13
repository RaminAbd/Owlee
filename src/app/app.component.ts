import { AfterViewInit, Component, inject } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import { Toast } from 'primeng/toast';
import { AppTranslateService } from './core/services/app-translate.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import {filter, map, mergeMap} from 'rxjs';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialog, TranslatePipe, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Owlee';
  private appTranslate: AppTranslateService = inject(AppTranslateService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private titleService: Title = inject(Title);
  constructor() {
    this.appTranslate.registerLanguages();

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
        this.titleService.setTitle(title);
      });
  }
}
