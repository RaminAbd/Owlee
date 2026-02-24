import {inject, Injectable} from '@angular/core';
import {CoursesApiService} from '../admin-courses/shared/services/courses.api.service';
import {CertificatesComponent} from './certificates.component';

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {
  private service:CoursesApiService = inject(CoursesApiService)
  component:CertificatesComponent
  constructor() { }

  getCertificates(){
    this.service.GetCertificates(localStorage.getItem('userId')).subscribe(resp=>{
      this.component.certificates = structuredClone(resp.data);
      this.component.filteredList = structuredClone(resp.data);
    })
  }
}
