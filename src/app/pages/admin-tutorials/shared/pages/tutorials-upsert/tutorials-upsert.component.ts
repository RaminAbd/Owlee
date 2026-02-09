import {Component, inject} from '@angular/core';
import {Location, NgClass, NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {UpsertHeadingComponent} from '../../../../../shared/components/upsert-heading/upsert-heading.component';
import {FaqsUpsertService} from '../../../../admin-faqs/shared/pages/faqs-upsert/faqs-upsert.service';
import {ActivatedRoute} from '@angular/router';
import {ApplicationMessageCenterService} from '../../../../../core/services/ApplicationMessageCenter.service';
import {FaqsRequestModel} from '../../../../admin-faqs/shared/models/faqs-request.model';
import {TutorialsRequestModel} from '../../models/tutorials-request.model';
import {TutorialsUpsertService} from './tutorials-upsert.service';
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-tutorials-upsert',
    imports: [
        NgForOf,
        ReactiveFormsModule,
        TranslatePipe,
        UpsertHeadingComponent,
        NgClass,
        FormsModule,
        DropdownModule
    ],
  templateUrl: './tutorials-upsert.component.html',
  styleUrl: './tutorials-upsert.component.scss'
})
export class TutorialsUpsertComponent {
  private service: TutorialsUpsertService = inject(
    TutorialsUpsertService,
  );
  private route: ActivatedRoute = inject(ActivatedRoute);
  public location: Location = inject(Location);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  id = this.route.snapshot.paramMap.get('id') as string;
  request: TutorialsRequestModel = new TutorialsRequestModel();
  isSubmitted: boolean = false;
  types: any[] = [
    { name: 'Educators', value: 1 },
    { name: 'Students', value: 2 },
  ];
  constructor() {
    this.service.component = this;
    this.service.getInfo();
  }

  save() {
    this.isSubmitted = true;
    this.service.save();
  }
}
