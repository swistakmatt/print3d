import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import SupportRequest from '../types/SupportRequest';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  private API_URL = 'http://localhost:3000/support';

  constructor(private http: HttpClient) {}

  submitSupportRequest(
    supportRequest: SupportRequest
  ): Observable<SupportRequest> {
    return this.http.post<SupportRequest>(`${this.API_URL}/`, supportRequest);
  }
}
