import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { AppTranslateService } from './core/services/app-translate.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialog, TranslatePipe, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Owlee';
  private appTranslate: AppTranslateService = inject(AppTranslateService);
  constructor() {
    this.appTranslate.registerLanguages();
  }
}
