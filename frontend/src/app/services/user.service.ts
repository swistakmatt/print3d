import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../types/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/all`, this.getHttpOptions());
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(
      `${this.API_URL}/${userId}`,
      this.getHttpOptions()
    );
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.API_URL}/search/${query}`,
      this.getHttpOptions()
    );
  }

  deleteUser(userId: string): Observable<any> {
    const options = {
      ...this.getHttpOptions(),
      body: { userId },
    };
    return this.http.delete(`${this.API_URL}`, options);
  }

  updateUsername(userId: string, username: string): Observable<any> {
    return this.http.put(
      `${this.API_URL}/username`,
      { userId, username },
      this.getHttpOptions()
    );
  }

  updateEmail(userId: string, email: string): Observable<any> {
    return this.http.put(
      `${this.API_URL}/email`,
      { userId, email },
      this.getHttpOptions()
    );
  }

  updateName(
    userId: string,
    firstName: string,
    lastName: string
  ): Observable<any> {
    return this.http.put(
      `${this.API_URL}/name`,
      { userId, firstName, lastName },
      this.getHttpOptions()
    );
  }

  getHttpOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.currentUserValue?.token}`,
      }),
    };
  }
}
