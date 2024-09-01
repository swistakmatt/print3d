import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../services/order.service';
import Order from '../../types/Order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule],
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

  toCapitalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order', orderId]);
  }
}
