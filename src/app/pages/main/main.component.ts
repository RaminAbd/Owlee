import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass, NgComponentOutlet } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { SideBarComponentByRole } from '../../core/role-handlers/SideBarComponentByRole';
import { HeaderComponentByRole } from '../../core/role-handlers/HeaderComponentByRole';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgComponentOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  role: string;
  navigationBarComponent: any;
  headerComponent: any;
  private storage: StorageService = inject(StorageService);
  pageTitle: string = 'Owlee';
  constructor() {
    var resp = this.storage.getObject('authResponse');
    this.role = resp.role;
    this.navigationBarComponent =
      SideBarComponentByRole[this.role as keyof typeof SideBarComponentByRole];
    this.headerComponent =
      HeaderComponentByRole[this.role as keyof typeof HeaderComponentByRole];
  }
}
