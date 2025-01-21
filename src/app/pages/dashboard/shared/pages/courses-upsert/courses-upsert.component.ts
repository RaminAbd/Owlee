import { Component, inject } from '@angular/core';
import { CoursesUpsertService } from './courses-upsert.service';
import { ActivatedRoute } from '@angular/router';
import {Location, NgClass, NgForOf, NgIf} from '@angular/common';
import {KnownLanguagesResponseModel} from '../../../../known-languages/shared/models/known-languages-response.model';
import {CourseRequestModel} from '../../models/course-request.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-courses-upsert',
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    NgForOf
  ],
  templateUrl: './courses-upsert.component.html',
  styleUrl: './courses-upsert.component.scss',
})
export class CoursesUpsertComponent {
  private service: CoursesUpsertService = inject(CoursesUpsertService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public location: Location = inject(Location);
  id = this.route.snapshot.paramMap.get('id') as string;
  languages: KnownLanguagesResponseModel[] = [];
  request:CourseRequestModel = new CourseRequestModel()
  isSubmitted = false;
  constructor() {
    this.service.component = this;
    this.service.getKnownLangs()
    if (this.id !== 'create') this.service.getCourse();
  }

  getFile(e: any) {
    this.request.image.fileLoading = true;
    this.service.getFile(e);
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

  save() {
    this.isSubmitted = true;
    this.service.save()
  }
}
