import {inject, Injectable} from '@angular/core';
import {FileModel} from '../../../../../core/models/File.model';
import {FaqsApiService} from '../../services/faqs.api.service';
import {FaqsUpsertComponent} from './faqs-upsert.component';

@Injectable({
  providedIn: 'root'
})
export class FaqsUpsertService {
  private service: FaqsApiService = inject(FaqsApiService);
  component: FaqsUpsertComponent;
  constructor() {}

  getInfo() {
    this.component.id === 'create' ? this.getForm() : this.getById();
  }

  private getForm() {
    this.service.GetForm(this.service.serviceUrl).subscribe((resp) => {
      this.component.request = resp.data;
      this.component.request.title.items.map((x) => (x.isValid = true));
      this.component.request.body.items.map((x) => (x.isValid = true));
    });
  }

  private getById() {
    this.service
      .GetById(this.service.serviceUrl, this.component.id)
      .subscribe((resp) => {
        this.component.request = resp.data;
        this.component.request.title.items.map((x) => (x.isValid = true));
        this.component.request.body.items.map((x) => (x.isValid = true));
      });
  }

  save() {
    if (this.isValid())
      this.component.id === 'create' ? this.create() : this.update();
    else
      this.component.message.showTranslatedWarningMessage(
        'Fields are not valid',
      );
  }

  private create() {
    this.service
      .Create(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.component.message.showTranslatedSuccessMessage(
            'Successfully created',
          );
          this.component.location.back();
        }
      });
  }

  private update() {
    this.service
      .Update(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.component.message.showTranslatedSuccessMessage(
            'Successfully updated',
          );
          this.component.location.back();
        }
      });
  }

  private isValid() {
    let result = true;
    this.component.request.title.items.forEach((x) => {
      if (!x.value) {
        result = false;
        x.isValid = false;
      } else {
        x.isValid = true;
      }
    });
    this.component.request.body.items.forEach((x) => {
      if (!x.value) {
        result = false;
        x.isValid = false;
      } else {
        x.isValid = true;
      }
    });
    return result;
  }
}
