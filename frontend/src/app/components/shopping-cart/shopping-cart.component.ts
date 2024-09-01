import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import Item from '../../types/Item';

interface CartItem {
  item: Item;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    ImageModule,
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    DropdownModule,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  filament_color: string = '';
  filament_type: string = '';
  filament_type_options: string[] = [
    'PLA',
    'ABS',
    'PETG',
    'TPU',
    'Carbon Fiber',
    'Nylon',
  ];
  filament_color_options: string[] = [
    'Black',
    'White',
    'Red',
    'Blue',
    'Green',
    'Yellow',
  ];
  address: string = '';
  city: string = '';
  postalCode: string = '';
  selectedCountry: string = 'Poland';
  phone: string = '';
  paymentMethod: string = 'BLIK';

  countries: string[] = ['Poland', 'Germany', 'Slovakia', 'Czechia', 'Hungary'];

  constructor(
    private orderService: OrderService,
    private toastService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.orderService.getCartItems();
  }

  removeItem(itemId: string): void {
    this.orderService.removeItemFromCart(itemId);
    this.loadCartItems();
  }

  increaseQuantity(itemId: string): void {
    this.orderService.addItemToCart(
      this.cartItems.find(cartItem => cartItem.item._id === itemId)!.item
    );
    this.loadCartItems();
  }

  decreaseQuantity(itemId: string): void {
    this.orderService.removeItemFromCart(itemId);
    this.loadCartItems();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, cartItem) => total + cartItem.item.price! * cartItem.quantity,
      0
    );
  }

  placeOrder(): void {
    const orderData = {
      items: this.cartItems.flatMap(cartItem =>
        Array(cartItem.quantity).fill(cartItem.item._id!)
      ),
      filament_type: this.filament_type,
      filament_color: this.filament_color,
      total: this.getTotalPrice(),
      status: 'processing',
      payment_method: this.paymentMethod,
      payment_status: 'processing',
      address: this.address,
      city: this.city,
      postalCode: this.postalCode,
      country: this.selectedCountry,
      phone: this.phone,
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.orderService.clearCart();
        this.loadCartItems();
        this.router.navigate(['/orders']);
      },
      error: error => {
        console.error(`Couldn't create an Order`, error);
      },
    });
  }
}
