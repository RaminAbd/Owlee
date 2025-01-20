import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Toast} from 'primeng/toast';
import {AppTranslateService} from './core/services/app-translate.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Owlee';
  private appTranslate:AppTranslateService = inject(AppTranslateService)
  constructor() {
    this.appTranslate.registerLanguages();
  }
}
