import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private API_URL = 'http://localhost:3000/storage';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ownerId', this.authService.currentUserValue?.userId!);

    return this.http.post(`${this.API_URL}/upload`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.currentUserValue?.token}`,
      }),
    });
  }

  searchFilesByOwnerId(): Observable<any> {
    return this.http.get(
      `${this.API_URL}/files/owner/${this.authService.currentUserValue?.userId}`,
      this.getHttpOptions()
    );
  }

  filterUserFiles(query: string): Observable<any> {
    return this.http.get(
      `${this.API_URL}/files/owner/${this.authService.currentUserValue?.userId}?query=${query}`,
      this.getHttpOptions()
    );
  }

  downloadFile(fileId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/file/download/${fileId}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.currentUserValue?.token}`,
      }),
    });
  }

  getFileDownloadUrl(fileId: string): string {
    return `${this.API_URL}/file/download/${fileId}`;
  }

  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/file/${fileId}`,
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
