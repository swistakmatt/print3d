import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../services/order.service';
import Order from '../../types/Order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, DividerModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private toastService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  getOrderTitle(order: Order): string {
    const uniqueItemNames = Array.from(
      new Set(order.items.map(item => item.name))
    );

    const itemNames = uniqueItemNames.join('_');

    const orderTitle = `${itemNames}_${order.filament_type}_${order.filament_color}`;

    return orderTitle;
  }

  toCapitalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order', orderId]);
  }
}
