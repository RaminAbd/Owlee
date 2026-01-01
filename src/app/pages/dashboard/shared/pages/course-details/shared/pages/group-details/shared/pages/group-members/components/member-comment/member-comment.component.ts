import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MemberCommentService } from './member-comment.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-member-comment',
  imports: [ReactiveFormsModule, TranslatePipe, FormsModule, NgForOf],
  templateUrl: './member-comment.component.html',
  styleUrl: './member-comment.component.scss',
})
export class MemberCommentComponent {
  private service: MemberCommentService = inject(MemberCommentService);
  public config: DynamicDialogConfig = inject(DynamicDialogConfig);
  public ref: DynamicDialogRef = inject(DynamicDialogRef);
  comments: any[] = []
  isSubmitted: boolean = false;
  comment: string='';
  request: any = this.config.data.request;
  constructor() {
    this.service.component = this;
    this.service.getComments()
  }
  addComment() {
    this.isSubmitted = true;
    if(this.comment){
      this.request.value = this.comment;
      this.service.addComment()
    }
  }

  getComment() {
    console.log(this.comment);
  }
}
