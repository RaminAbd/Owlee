import {Component, OnDestroy} from '@angular/core';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {NgForOf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {TutorialsResponseModel} from '../../../../admin-tutorials/shared/models/tutorials-response.model';
import {
  LecturerTutorialsService
} from '../../../../lecturer-help/shared/pages/lecturer-tutorials/lecturer-tutorials.service';
import {StudentTutorialsService} from './student-tutorials.service';

@Component({
  selector: 'app-student-tutorials',
    imports: [
        Accordion,
        AccordionContent,
        AccordionHeader,
        AccordionPanel,
        NgForOf,
        TranslatePipe
    ],
  templateUrl: './student-tutorials.component.html',
  styleUrl: './student-tutorials.component.scss'
})
export class StudentTutorialsComponent implements OnDestroy{
  tutorials: TutorialsResponseModel[] = []

  constructor(private service: StudentTutorialsService) {
    this.service.component = this;
    this.service.getAllTutorials()
    this.service.subscribeToLangEvent()
  }

  ngOnDestroy() {
    this.service.subscribe.unsubscribe()
  }
}
