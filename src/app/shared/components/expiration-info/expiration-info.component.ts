import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-expiration-info',
  imports: [TranslatePipe, NgIf],
  templateUrl: './expiration-info.component.html',
  styleUrl: './expiration-info.component.scss',
})
export class ExpirationInfoComponent {
  data:any
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.data = config.data;
  }
}
