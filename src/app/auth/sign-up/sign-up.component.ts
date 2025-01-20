import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EducatorSignupRequestModel } from './shared/models/educator-signup-request.model';
import { SignUpService } from './sign-up.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-sign-up',
  imports: [NgIf, ReactiveFormsModule, RouterLink, TranslatePipe, FormsModule],
  templateUrl: './sign-up.component.html',
  animations: [
    trigger('expanderAnimation', [
      state(
        'collapsed',
        style({
          maxHeight: '0px',
          opacity: 0,
          padding:0
        }),
      ),
      state(
        'expanded',
        style({
          // maxHeight: '200px',
          opacity: 1,
        }),
      ),
      transition('collapsed <=> expanded', [animate('0.3s ease-out')]),
    ]),
  ],
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  expanderStates: string[] = [];
  private service: SignUpService = inject(SignUpService);
  private fb: FormBuilder = inject(FormBuilder);
  request: EducatorSignupRequestModel = new EducatorSignupRequestModel();
  firstStepSubmitted = false;
  firstStepPassed: boolean = false;
  constructor() {
    this.service.component = this;
    this.expanderStates = Array.from({ length: 4 }, () => 'expanded');
  }

  myForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    day: ['', [Validators.required]],
    month: ['', [Validators.required]],
    year: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    location: ['', [Validators.required]],
    password: ['', Validators.required],
    confirmPassword: ['', [Validators.required]],
    code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
  });
  toggleExpander(index: number) {
    this.expanderStates = this.expanderStates.map((_, i) =>
      i === index ? 'expanded' : 'collapsed',
    );
    console.log(this.expanderStates, index);
  }
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  validateFirstStep() {
    this.firstStepSubmitted = true;
    console.log(this.request);
    this.service.validateFirstStep();
  }
}
