import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApplicationMessageCenterService } from './ApplicationMessageCenter.service';
import { environment } from '../environments/environment';
import { ServiceResponse } from '../models/ServiceResponse.model';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  BASE_URL: string = environment.apiUrl;
  http: HttpClient;
  constructor(
    http: HttpClient,
    private handler: ApplicationMessageCenterService,
  ) {
    this.http = http;
  }

  get(url?: string, parameter?: any, paramsObj?: any) {
    let request: Observable<ServiceResponse>;
    if (parameter !== null) {
      request = this.http.get<ServiceResponse>(this.BASE_URL + url + parameter);
    } else {
      request = this.http.get<ServiceResponse>(this.BASE_URL + url, {
        params: paramsObj,
      });
    }
    return this.handleRequest(request);
  }

  post(url?: string, object?: any) {
    const request = this.http.post<ServiceResponse>(
      this.BASE_URL + url,
      object,
    );
    return this.handleRequest(request);
  }

  delete(url?: string, parameter?: any, paramsObj?: any) {
    let request: Observable<ServiceResponse>;

    if (parameter !== null) {
      request = this.http.delete<ServiceResponse>(
        this.BASE_URL + url + parameter,
      );
    } else {
      request = this.http.delete<ServiceResponse>(this.BASE_URL + url, {
        params: paramsObj,
      });
    }
    return this.handleRequest(request);
  }
  deleteFromBody(url: string, req: any) {
    let request: Observable<ServiceResponse>;
    request = this.http.delete<ServiceResponse>(this.BASE_URL + url, {
      body: req,
    });
    return this.handleRequest(request);
  }

  private handleRequest(request: Observable<ServiceResponse>): Observable<any> {
    return request.pipe(
      map((response: ServiceResponse) => {
        if (!response.succeeded) {
          this.handler.handleError(response);
          return;
        } else {
          return response;
        }
      }),
    );
  }
}
