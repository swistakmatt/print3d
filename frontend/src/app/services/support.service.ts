import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import SupportRequest from '../types/SupportRequest';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  private API_URL = 'http://localhost:3000/support';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  submitSupportRequest(
    supportRequest: SupportRequest
  ): Observable<SupportRequest> {
    return this.http.post<SupportRequest>(`${this.API_URL}/`, supportRequest);
  }

  getSupportRequests(): Observable<SupportRequest[]> {
    return this.http.get<SupportRequest[]>(
      `${this.API_URL}/`,
      this.getHttpOptions()
    );
  }

  searchSupportRequests(query: string): Observable<SupportRequest[]> {
    return this.http.get<SupportRequest[]>(
      `${this.API_URL}/search/${query}`,
      this.getHttpOptions()
    );
  }

  resolveSupportRequest(id: string): Observable<SupportRequest> {
    return this.http.put<SupportRequest>(
      `${this.API_URL}/${id}/resolve/`,
      {},
      this.getHttpOptions()
    );
  }

  deleteSupportRequest(id: string): Observable<SupportRequest> {
    return this.http.delete<SupportRequest>(
      `${this.API_URL}/${id}`,
      this.getHttpOptions()
    );
  }

  private getHttpOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.currentUserValue?.token}`,
      }),
    };
  }
}
