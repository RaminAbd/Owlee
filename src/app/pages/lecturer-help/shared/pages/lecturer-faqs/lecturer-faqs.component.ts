import { Component } from '@angular/core';
import {FaqsResponseModel} from '../../../../admin-faqs/shared/models/faqs-response.model';
import {LecturerFaqsService} from './lecturer-faqs.service';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel, AccordionTab} from 'primeng/accordion';
import {TranslatePipe} from '@ngx-translate/core';
import {NgForOf} from '@angular/common';
import {PrimeTemplate} from 'primeng/api';

@Component({
  selector: 'app-lecturer-faqs',
  imports: [
    Accordion,
    AccordionTab,
    TranslatePipe,
    NgForOf,
    PrimeTemplate,
    AccordionPanel,
    AccordionHeader,
    AccordionContent
  ],
  templateUrl: './lecturer-faqs.component.html',
  styleUrl: './lecturer-faqs.component.scss'
})
export class LecturerFaqsComponent {
  FAQs: FaqsResponseModel[] = []

  constructor(private service: LecturerFaqsService) {
    this.service.component = this;
    this.service.getAllFAQs()
    this.service.subscribeToLangEvent()
  }

  ngOnDestroy() {
    this.service.subscribe.unsubscribe()
  }
}
