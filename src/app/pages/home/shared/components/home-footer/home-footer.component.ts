import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-home-footer',
    imports: [
        RouterLink,
        TranslatePipe,
        RouterLinkActive
    ],
  templateUrl: './home-footer.component.html',
  styleUrl: './home-footer.component.scss'
})
export class HomeFooterComponent {
  private router: Router = inject(Router);

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
}
