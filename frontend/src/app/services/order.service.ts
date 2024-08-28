import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import Item from '../types/Item';
import Order from '../types/Order';

interface CartItem {
  item: Item;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private API_URL = 'http://localhost:3000/orders';
  private storageKey = 'shoppingCart';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getCartItems(): CartItem[] {
    const items = localStorage.getItem(this.storageKey);
    return items ? JSON.parse(items) : [];
  }

  getNumberOfItemsInCart(): number {
    return this.getCartItems().reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
  }

  addItemToCart(item: Item): void {
    const currentCart = this.getCartItems();
    const existingCartItem = currentCart.find(
      cartItem => cartItem.item._id === item._id
    );

    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      currentCart.push({ item, quantity: 1 });
    }

    localStorage.setItem(this.storageKey, JSON.stringify(currentCart));
  }

  removeItemFromCart(itemId: string): void {
    let currentCart = this.getCartItems();
    const cartItemIndex = currentCart.findIndex(
      cartItem => cartItem.item._id === itemId
    );

    if (cartItemIndex >= 0) {
      if (currentCart[cartItemIndex].quantity > 1) {
        currentCart[cartItemIndex].quantity--;
      } else {
        currentCart = currentCart.filter(
          cartItem => cartItem.item._id !== itemId
        );
      }
    }

    localStorage.setItem(this.storageKey, JSON.stringify(currentCart));
  }

  clearCart(): void {
    localStorage.removeItem(this.storageKey);
  }

  createOrder(orderData: Partial<Order>): Observable<any> {
    const userId = this.authService.currentUserValue?.userId;

    const order = {
      ...orderData,
      user: userId,
    };

    return this.http.post<Order>(
      `${this.API_URL}/`,
      order,
      this.getHttpOptions()
    );
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(
      `${this.API_URL}/${orderId}`,
      { status },
      this.getHttpOptions()
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL, this.getHttpOptions());
  }

  searchOrders(query: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.API_URL}/search/${query}`,
      this.getHttpOptions()
    );
  }

  getUserOrders(): Observable<Order[]> {
    const userId = this.authService.currentUserValue?.userId;
    return this.http.get<Order[]>(
      `${this.API_URL}/user/${userId}`,
      this.getHttpOptions()
    );
  }

  getOrderDetails(orderId: string): Observable<Order> {
    return this.http.get<Order>(
      `${this.API_URL}/${orderId}`,
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
