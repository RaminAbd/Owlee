import { Component, inject } from '@angular/core';
import { DashboardResponseModel } from './shared/models/dashboard-response.model';
import { DashboardService } from './dashboard.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesResponseModel } from '../admin-courses/shared/models/courses-response.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe, FormsModule, NgForOf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  response: DashboardResponseModel = new DashboardResponseModel();
  private service: DashboardService = inject(DashboardService);
  private router: Router = inject(Router);
  searchText: string;
  constructor() {
    this.service.component = this;
    this.service.getDashboard();
  }
  create() {
    console.log('jdsv')
    this.router.navigate(['/main/educator/course/upsert', 'create']);
  }
  getInfo(item: CoursesResponseModel) {
    this.router.navigate(['/main/educator/course/upsert', item.id]);
  }
}
