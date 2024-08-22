import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import Item from '../types/Item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private API_URL = 'http://localhost:3000/items';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createItem(item: Item): Observable<Item> {
    item.user = this.authService.currentUserValue?.userId as string;
    return this.http.post<Item>(`${this.API_URL}`, item, this.getHttpOptions());
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.API_URL}`, this.getHttpOptions());
  }

  getItemById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.API_URL}/${id}`, this.getHttpOptions());
  }

  searchItemsByOwnerId(): Observable<Item[]> {
    return this.http.get<Item[]>(
      `${this.API_URL}/owner/${this.authService.currentUserValue?.userId}`,
      this.getHttpOptions()
    );
  }

  updateItem(id: string, item: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(
      `${this.API_URL}/${id}`,
      item,
      this.getHttpOptions()
    );
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(
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
