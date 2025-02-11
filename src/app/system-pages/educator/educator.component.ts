import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EducatorService } from './educator.service';

@Component({
  selector: 'app-educator',
  imports: [RouterOutlet],
  templateUrl: './educator.component.html',
  styleUrl: './educator.component.scss',
})
export class EducatorComponent {
  private service: EducatorService = inject(EducatorService);
  constructor() {
    this.service.checkDays();
  }
}
