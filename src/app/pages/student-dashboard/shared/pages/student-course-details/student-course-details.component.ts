import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { StudentCourseDetailsService } from './student-course-details.service';
import { CourseRequestModel } from '../../../../dashboard/shared/models/course-request.model';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { CourseDetailedResponseModel } from '../../models/course-detailed-response.model';
import { KnownLanguagesResponseModel } from '../../../../known-languages/shared/models/known-languages-response.model';
import { SubtopicModel } from '../../../../dashboard/shared/models/subtopic.model';
import { TopicRequestModel } from '../../../../dashboard/shared/models/topic-request.model';
import { FormsModule } from '@angular/forms';
import { TopicMaterialModel } from '../../../../dashboard/shared/models/topic-material.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AssignmentsResponseModel
} from '../../../../dashboard/shared/pages/course-details/shared/pages/course-assignments/shared/models/assignments-response.model';
import {DialogService} from 'primeng/dynamicdialog';
import {CertificateResponseModel} from '../../models/certificate-response.model';
import {FormatDate} from '../../../../../core/extensions/format-date';

@Component({
  selector: 'app-student-course-details',
  imports: [NgIf, TranslatePipe, NgClass, NgForOf, FormsModule, DatePipe, RouterLink],
  templateUrl: './student-course-details.component.html',
  styleUrl: './student-course-details.component.scss',
  animations: [
    trigger('expanderAnimation', [
      state(
        'collapsed',
        style({
          maxHeight: '0px',
          opacity: 0,
          zIndex: -1,
        }),
      ),
      state(
        'expanded',
        style({
          maxHeight: '200px',
          opacity: 1,
          zIndex: 1,
        }),
      ),
      transition('collapsed <=> expanded', [animate('0.3s ease-out')]),
    ]),
  ],
})
export class StudentCourseDetailsComponent implements OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private dialogService: DialogService = inject(DialogService);
  private router: Router = inject(Router);
  private service: StudentCourseDetailsService = inject(
    StudentCourseDetailsService,
  );
  id = this.route.snapshot.paramMap.get('id') as string;
  response: CourseDetailedResponseModel = new CourseDetailedResponseModel();
  selectedTab: number = 1;
  selectedMatTab: number = 1;
  showEducator: boolean = false;
  languages: KnownLanguagesResponseModel[] = [];
  allFiles: TopicMaterialModel[] = [];
  filteredFiles: TopicMaterialModel[] = [];
  langSubscribtion: any;
  expanderStates: string[] = [];
  assignments:AssignmentsResponseModel[]=[]
  showRating:boolean = false
  showCertificate:boolean = false
  constructor() {
    this.service.component = this;
    this.service.getKnownLangs();
    this.service.getAllAssignments();
    this.service.getCertificate()
    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getKnownLangs();
      },
    );
  }

  back() {
    this.router.navigate(['/main/student/dashboard']);
  }

  @ViewChildren('subTopic') subTopics!: QueryList<ElementRef>;

  goToSubTopic(sub: any) {
    const subTopicElement = this.subTopics.find(
      (item: ElementRef) =>
        item.nativeElement.querySelector('.sub-name').textContent === sub.name,
    );
    if (subTopicElement) {
      subTopicElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  searchTerm: string;
  filteredTopics: TopicRequestModel[] = [];
  filterTopics() {
    if (!this.searchTerm) {
      this.filteredTopics = [...this.response.topics];
      return;
    }

    this.filteredTopics = this.response.topics
      .map((topic) => ({
        ...topic,
        subtopics: topic.subtopics.filter(
          (sub) =>
            sub.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            topic.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
        ),
      }))
      .filter((topic) => topic.subtopics.length > 0);
  }

  fileText: any;

  filterFiles() {
    this.filteredFiles = this.allFiles.filter((obj) =>
      obj.name.toLowerCase().includes(this.fileText.toLowerCase()),
    );
  }

  toggleExpander(index: number) {
    this.expanderStates[index] === 'expanded'
      ? (this.expanderStates[index] = 'collapsed')
      : (this.expanderStates[index] = 'expanded');
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }

  getAssignment(item: AssignmentsResponseModel) {

  }

  downloadFile(mat: any) {
    mat.fileLoading = true
    this.service.downloadFile(mat)
  }

  formatDate(date: any) {
    return new FormatDate(new Date(date), false).formattedDate;
  }

  certData:CertificateResponseModel = new CertificateResponseModel();
  printCertificate() {

    const data = structuredClone(this.certData);
    data.issueDate = this.formatDate(this.certData.issueDate)
    const printContent = `
    <html>
      <head>
        <title>Certificate - ${data.userName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cert-wrapper {
            width: 297mm;
            height: 210mm;
            position: relative;
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 40mm;
            box-sizing: border-box;
            overflow: hidden;
          }

          /* Borders */
          .outer-border {
            position: absolute;
            inset: 10mm;
            border: 4pt solid #10b981;
          }
          .inner-border {
            position: absolute;
            inset: 15mm;
            border: 1.5pt solid rgba(67, 56, 202, 0.3);
          }

          /* Corner Ornament SVG */
          .ornament {
            position: absolute;
            width: 50mm;
            height: 50mm;
            color: #10b981;
          }
          .top-left { top: 18mm; left: 18mm; }
          .top-right { top: 18mm; right: 18mm; transform: rotate(90deg); }
          .bottom-right { bottom: 18mm; right: 18mm; transform: rotate(180deg); }
          .bottom-left { bottom: 18mm; left: 18mm; transform: rotate(-90deg); }

          /* Content */
          header { text-align: center; z-index: 10; }
          .brand { font-size: 28pt; font-weight: bold; color: #4338ca; margin-bottom: 5mm; }
          .subtitle { font-size: 12pt; text-transform: uppercase; letter-spacing: 0.4em; color: #6b7280; }

          main { text-align: center; z-index: 10; }
          .recipient { font-family: 'Dancing Script', cursive; font-size: 60pt; color: #4338ca; margin: 10mm 0; }
          .course { font-size: 24pt; font-weight: 600; color: #111827; }

          footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            z-index: 10;
          }
          .sig-block { text-align: center; width: 60mm; }
          .sig-name { font-family: 'Dancing Script', cursive; font-size: 22pt; color: #10b981; }
          .sig-line { border-top: 1pt solid #ccc; margin: 2mm 0; }
          .sig-label { font-size: 8pt; text-transform: uppercase; color: #6b7280; }

          .seal { text-align: center; }
          .seal-circle {
            width: 25mm; height: 25mm; border-radius: 50%; border: 2pt solid #d4af37;
            display: flex; align-items: center; justify-content: center; margin-bottom: 2mm;
          }
          .id-text { font-size: 8pt; color: #9ca3af; }

          /* Background Shapes */
          .bg-shape { position: absolute; border-radius: 50%; z-index: 1; }
          .shape-1 { top: -10mm; right: -10mm; width: 80mm; height: 80mm; background: rgba(16, 185, 129, 0.05); }
          .shape-2 { bottom: -10mm; left: -10mm; width: 100mm; height: 100mm; background: rgba(67, 56, 202, 0.05); }
        </style>
      </head>
      <body>
        <div class="cert-wrapper">
          <div class="outer-border"></div>
          <div class="inner-border"></div>

          <svg class="ornament top-left" viewBox="0 0 48 48" fill="none"><path d="M4 4 L24 4 M4 4 L4 24" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>
          <svg class="ornament top-right" viewBox="0 0 48 48" fill="none"><path d="M4 4 L24 4 M4 4 L4 24" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>
          <svg class="ornament bottom-right" viewBox="0 0 48 48" fill="none"><path d="M4 4 L24 4 M4 4 L4 24" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>
          <svg class="ornament bottom-left" viewBox="0 0 48 48" fill="none"><path d="M4 4 L24 4 M4 4 L4 24" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>

<!--          <div class="bg-shape shape-1"></div>-->
<!--          <div class="bg-shape shape-2"></div>-->

          <header>
            <div class="brand">Owlee</div>
            <div class="subtitle">Certificate of Completion</div>
          </header>

          <main>
            <p style="color: #6b7280">This is to certify that</p>
            <div class="recipient">${data.userName}</div>
            <p style="color: #6b7280">has successfully completed the course</p>
            <div class="course">${data.courseName}</div>
            <p style="margin-top: 5mm; color: #6b7280">Issued on <b>${data.issueDate}</b></p>
          </main>

          <footer>
            <div class="sig-block">
              <div class="sig-name">${data.instructor}</div>
              <div class="sig-line"></div>
              <div class="sig-label">Course Instructor</div>
            </div>

            <div class="seal">
              <div class="seal-circle">
                 <span style="color: #d4af37; font-weight: bold; font-size: 8pt;">VERIFIED</span>
              </div>
              <div class="id-text">ID: ${data.certificateId}</div>
            </div>

            <div class="sig-block">
              <div class="sig-name">Iusip Nasibov</div>
              <div class="sig-line"></div>
              <div class="sig-label">CEO, Owlee</div>
            </div>
          </footer>
        </div>
      </body>
    </html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Wait for fonts to load before printing
      if ((printWindow as any).document.fonts) {
        (printWindow as any).document.fonts.ready.then(() => {
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
          }, 250);
        });
      } else {
        // Fallback for older browsers
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
      }
    }
  }
}
