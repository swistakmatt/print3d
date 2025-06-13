import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../types/User';

interface UserRegister {
  email: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private API_URL = 'http://localhost:3000/auth';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    let currentUser: User | null = null;

    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  login(
    username: string,
    password: string,
    permanentJwt: boolean
  ): Observable<User> {
    return this.http
      .post<User>(
        `${this.API_URL}/login`,
        { username, password, permanentJwt },
        this.httpOptions
      )
      .pipe(
        map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(user: UserRegister): Observable<User> {
    return this.http
      .post<User>(`${this.API_URL}/register`, user, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null!);
  }
}
