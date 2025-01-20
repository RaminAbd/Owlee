import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-upsert-heading',
  imports: [TranslatePipe],
  templateUrl: './upsert-heading.component.html',
  styleUrl: './upsert-heading.component.scss',
})
export class UpsertHeadingComponent {
  public location: Location = inject(Location);
  @Output() save = new EventEmitter();
  @Input() name: string;
}
