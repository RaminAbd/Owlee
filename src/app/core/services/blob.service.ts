import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseCrudApiService } from './base-crud.api.service';
import { ApplicationMessageCenterService } from './ApplicationMessageCenter.service';
import { FileModel } from '../models/File.model';

@Injectable({
  providedIn: 'root',
})
export class BlobService extends BaseCrudApiService {
  ServiceUrl: string = 'v1/Files/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  UploadFile(file: any) {
    return this.post(this.ServiceUrl + 'Upload', file);
  }
  Download(file: FileModel) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', file.fileExtension);
    return this.http.get(
      this.BASE_URL + this.ServiceUrl + `Download/${file.id}`,
      {
        headers: headers,
        responseType: 'blob',
      },
    );
    //test
  }
  GetBlobFile(blob: Blob) {
    const file = new Blob([blob], { type: '.xslx' });
    const fileURL = URL.createObjectURL(file);
    var a = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    a.download = 'Packages.xlsx';
    document.body.appendChild(a);
    a.click();
  }
}
