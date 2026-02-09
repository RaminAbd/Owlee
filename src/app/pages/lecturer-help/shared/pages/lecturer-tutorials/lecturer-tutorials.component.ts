import { Component, OnDestroy } from '@angular/core';
import { FaqsResponseModel } from '../../../../admin-faqs/shared/models/faqs-response.model';
import { LecturerFaqsService } from '../lecturer-faqs/lecturer-faqs.service';
import { LecturerTutorialsService } from './lecturer-tutorials.service';
import { TutorialsResponseModel } from '../../../../admin-tutorials/shared/models/tutorials-response.model';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
} from 'primeng/accordion';
import { NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-lecturer-tutorials',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    NgForOf,
    TranslatePipe,
  ],
  templateUrl: './lecturer-tutorials.component.html',
  styleUrl: './lecturer-tutorials.component.scss',
})
export class LecturerTutorialsComponent implements OnDestroy {
  tutorials: TutorialsResponseModel[] = [];

  constructor(private service: LecturerTutorialsService) {
    this.service.component = this;
    this.service.getAllTutorials();
    this.service.subscribeToLangEvent();
  }

  ngOnDestroy() {
    this.service.subscribe.unsubscribe();
  }
}
