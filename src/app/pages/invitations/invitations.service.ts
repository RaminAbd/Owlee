import {EventEmitter, inject, Injectable} from '@angular/core';
import { StudentsApiService } from '../students/shared/services/students.api.service';
import { StorageService } from '../../core/services/storage.service';
import { AuthRequestModel } from '../../auth/shared/models/auth-request.model';
import {ApplicationMessageCenterService} from '../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class InvitationsService {
  private service: StudentsApiService = inject(StudentsApiService);
  private storage: StorageService = inject(StorageService);
  private message: ApplicationMessageCenterService = inject(ApplicationMessageCenterService);
  invitationsUpdated:any = new EventEmitter();
  constructor() {}

  getAllInvitations() {
    let req = this.storage.getObject('authRequest') as AuthRequestModel;
    console.log(req)
    const req1 = {
      username:req.userName
    }
    return this.service.GetInvitations(req1);
  }

  accept(invitationId: any) {
    const req ={
      studentId:localStorage.getItem('userId') as string,
      groupMemberId:invitationId,
    }
    this.service.Accept(req).subscribe(resp => {
      if(resp.succeeded){
        this.invitationsUpdated.emit();
        this.message.showTranslatedSuccessMessage('Accepted Invitation');
      }
    })

  }
  reject(invitationId: any) {
    const req ={
      studentId:localStorage.getItem('userId') as string,
      groupMemberId:invitationId,
    }
    this.service.Reject(req).subscribe(resp => {
      if(resp.succeeded){
        this.invitationsUpdated.emit();
        this.message.showTranslatedSuccessMessage('Accepted Invitation');
      }
    })

  }
}
