import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NgClass, NgComponentOutlet } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../core/services/storage.service';
import { SideBarComponentByRole } from '../../core/role-handlers/SideBarComponentByRole';
import { filter, map, mergeMap } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgComponentOutlet, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  role: string;
  navigationBarComponent: any;
  private titleService: Title = inject(Title);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private storage: StorageService = inject(StorageService);
  pageTitle:string = 'Owlee';
  constructor() {
    var resp = this.storage.getObject('authResponse');
    this.role = resp.role;
    this.navigationBarComponent =
      SideBarComponentByRole[this.role as keyof typeof SideBarComponentByRole];
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
}
