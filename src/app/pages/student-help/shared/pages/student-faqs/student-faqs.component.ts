import { Component, OnDestroy } from '@angular/core';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
} from 'primeng/accordion';
import { NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FaqsResponseModel } from '../../../../admin-faqs/shared/models/faqs-response.model';
import { LecturerFaqsService } from '../../../../lecturer-help/shared/pages/lecturer-faqs/lecturer-faqs.service';
import { StudentFaqsService } from './student-faqs.service';

@Component({
  selector: 'app-student-faqs',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    NgForOf,
    TranslatePipe,
  ],
  templateUrl: './student-faqs.component.html',
  styleUrl: './student-faqs.component.scss',
})
export class StudentFaqsComponent implements OnDestroy {
  FAQs: FaqsResponseModel[] = [];

  constructor(private service: StudentFaqsService) {
    this.service.component = this;
    this.service.getAllFAQs();
    this.service.subscribeToLangEvent();
  }

  ngOnDestroy() {
    this.service.subscribe.unsubscribe();
  }
}
