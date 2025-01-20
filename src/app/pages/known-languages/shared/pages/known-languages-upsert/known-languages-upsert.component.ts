import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location, NgClass, NgForOf} from '@angular/common';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';
import { KnownLanguagesRequestModel } from '../../models/known-languages-request.model';
import { KnownLanguagesUpsertService } from './known-languages-upsert.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {UpsertHeadingComponent} from '../../../../../shared/components/upsert-heading/upsert-heading.component';

@Component({
  selector: 'app-known-languages-upsert',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    UpsertHeadingComponent,
    NgClass,
    FormsModule,
    NgForOf
  ],
  templateUrl: './known-languages-upsert.component.html',
  styleUrl: './known-languages-upsert.component.scss',
})
export class KnownLanguagesUpsertComponent {
  private service: KnownLanguagesUpsertService = inject(
    KnownLanguagesUpsertService,
  );
  private route: ActivatedRoute = inject(ActivatedRoute);
  public location: Location = inject(Location);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  id = this.route.snapshot.paramMap.get('id') as string;
  request: KnownLanguagesRequestModel = new KnownLanguagesRequestModel();
  isSubmitted: boolean = false;
  constructor() {
    this.service.component = this;
    this.service.getInfo();
  }

  save() {
    this.service.save();
  }
}
