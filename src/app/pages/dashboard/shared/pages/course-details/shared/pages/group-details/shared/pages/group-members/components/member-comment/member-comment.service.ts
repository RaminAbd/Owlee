import { inject, Injectable } from '@angular/core';
import { MemberCommentComponent } from './member-comment.component';
import { NotesApiService } from '../../../../../../../../../../services/notes.api.service';

@Injectable({
  providedIn: 'root',
})
export class MemberCommentService {
  component: MemberCommentComponent;
  private notesService: NotesApiService = inject(NotesApiService);

  constructor() {}

  getComments() {
    this.notesService
      .GetAllByStudent(this.component.request)
      .subscribe((resp) => {
        this.component.comments = resp.data;
        this.component.comment = '';
        this.component.isSubmitted = false;
      });
  }

  addComment() {
    this.notesService
      .Create(this.notesService.serviceUrl, this.component.request)
      .subscribe((resp) => {
        this.getComments();
      });
  }
}
