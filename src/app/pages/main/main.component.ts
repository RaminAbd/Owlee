import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {NgClass, NgComponentOutlet} from '@angular/common';
import {StorageService} from '../../core/services/storage.service';
import {NavigationBarComponent} from '../../shared/components/navigation-bar/navigation-bar.component';
import {AdminNavigationBarComponent} from '../../shared/components/admin-navigation-bar/admin-navigation-bar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    NgComponentOutlet,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  navigationBarComponent: any = AdminNavigationBarComponent;
}
