import { Component } from '@angular/core';
import {HomeHeaderComponent} from './shared/components/home-header/home-header.component';

@Component({
  selector: 'app-home',
  imports: [
    HomeHeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
