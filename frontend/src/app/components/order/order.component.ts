import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { DataViewModule } from 'primeng/dataview';
import { ImageModule } from 'primeng/image';
import { OrderService } from '../../services/order.service';
import { ItemService } from '../../services/item.service';
import Order from '../../types/Order';
import Item from '../../types/Item';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, DividerModule, DataViewModule, ImageModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  order?: Order;
  orderItems: Item[] = [];

  constructor(
    private orderService: OrderService,
    private itemService: ItemService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  toCapitalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderDetails(orderId).subscribe({
        next: (order: Order) => {
          this.order = order;
        },
        error: err => {
          console.error('Failed to load order', err);
        },
      });
    }
  }
}
