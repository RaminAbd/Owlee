import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location, NgClass, NgForOf, NgIf} from '@angular/common';
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
    NgForOf,
    NgIf
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
    this.isSubmitted = true;
    this.service.save();
  }

  getFile(e: any) {
    this.request.icon.fileLoading = true;
    this.service.getFile(e, (resp: any) => {
      this.request.icon.fileLoading = false;
      this.request.icon = resp.data;
      this.request.icon.fakeFile = null;
      this.request.icon.isValid = true;
    });
  }

  getFileName(fileName: string): string {
    if (fileName) {
      if (fileName.length > 30) {
        return this.changeFileName(fileName);
      } else {
        return fileName;
      }
    } else {
      return '';
    }
  }

  changeFileName(name: string) {
    return (
      name.substring(0, 10) +
      '...' +
      name.substring(name.length - 5, name.length)
    );
  }
}
