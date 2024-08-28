import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ItemService } from '../../services/item.service';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import Item from '../../types/Item';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    ImageModule,
    InputTextModule,
    DividerModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {
  items: Item[] = [];
  searchQuery: string = '';
  itemsInCart: number = 0;

  constructor(
    private router: Router,
    private itemService: ItemService,
    private orderService: OrderService,
    private toastService: MessageService
  ) {}

  ngOnInit(): void {
    this.updateCartCount();
    this.loadItems();
  }

  loadItems(): void {
    this.itemService
      .filterPublicItems(this.searchQuery)
      .subscribe((items: Item[]) => {
        this.items = items;
      });
  }

  onClear(): void {
    this.searchQuery = '';
    this.loadItems();
  }

  onRefresh(): void {
    this.loadItems();
  }

  onSearch(): void {
    this.loadItems();
  }

  addToCart(item: Item): void {
    this.orderService.addItemToCart(item);
    this.toastService.add({
      severity: 'success',
      detail: `${item.name} added to Cart`,
    });
    this.updateCartCount();
  }

  updateCartCount(): void {
    this.itemsInCart = this.orderService.getNumberOfItemsInCart();
  }

  goToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }
}
