import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { ItemService } from '../../services/item.service';
import { OrderService } from '../../services/order.service';
import { SupportService } from '../../services/support.service';
import { UserService } from '../../services/user.service';
import { ItemComponent } from '../dialogs/item/item.component';
import { File } from '../../types/File';
import Item from '../../types/Item';
import Order from '../../types/Order';
import Support from '../../types/SupportRequest';
import { User } from '../../types/User';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    TabMenuModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    ItemComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild(ItemComponent) itemDialog!: ItemComponent;

  menuItems: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  searchQuery: string = '';

  files: File[] = [];
  selectedFiles: File[] = [];
  items: Item[] = [];
  selectedItems: Item[] = [];
  orders: Order[] = [];
  selectedOrders: Order[] = [];
  supports: Support[] = [];
  selectedSupports: Support[] = [];
  users: User[] = [];
  selectedUsers: User[] = [];

  constructor(
    private fileService: FileService,
    private itemService: ItemService,
    private orderService: OrderService,
    private supportService: SupportService,
    private userService: UserService,
    private toastService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Files',
        icon: 'pi pi-fw pi-file',
        command: () => this.loadFiles(),
      },
      {
        label: 'Items',
        icon: 'pi pi-fw pi-box',
        command: () => this.loadItems(),
      },
      {
        label: 'Orders',
        icon: 'pi pi-fw pi-shopping-bag',
        command: () => this.loadOrders(),
      },
      {
        label: 'Support Requests',
        icon: 'pi pi-fw pi-question-circle',
        command: () => this.loadSupports(),
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        command: () => this.loadUsers(),
      },
    ];
    this.activeItem = this.menuItems[0];
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.searchFilesByOwnerId().subscribe(files => {
      this.files = files;
    });
  }

  loadItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  getOrdersItems(order: Order): string {
    const uniqueItemNames = Array.from(
      new Set(order.items.map(item => item.name))
    );

    return uniqueItemNames.join(', ');
  }

  loadSupports(): void {
    this.supportService.getSupportRequests().subscribe(supports => {
      this.supports = supports;
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  openCreateItemDialog(): void {
    this.itemDialog.open();
  }

  openEditItemDialog(item: Item): void {
    this.itemDialog.open(item);
  }

  filterUnsetPrices(): void {
    this.items = this.items.filter(item => !item.price);
  }

  deleteItem(item: Item): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      accept: () => {
        this.itemService.deleteItem(item._id!).subscribe(() => {
          this.loadItems();
          this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item deleted successfully.',
          });
        });
      },
    });
  }

  deleteFile(file: File): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this file?',
      accept: () => {
        this.fileService.deleteFile(file._id).subscribe(() => {
          this.loadFiles();
          this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File deleted successfully.',
          });
        });
      },
    });
  }

  deleteOrder(order: Order): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this order?',
      accept: () => {
        this.orderService.deleteOrder(order._id!).subscribe(() => {
          this.loadOrders();
          this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order deleted successfully.',
          });
        });
      },
    });
  }

  resolveSupport(support: Support): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to resolve this support request?',
      accept: () => {
        this.supportService
          .resolveSupportRequest(support._id!)
          .subscribe(() => {
            this.loadSupports();
            this.toastService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Support request resolved successfully.',
            });
          });
      },
    });
  }

  deleteSupport(support: Support): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this support request?',
      accept: () => {
        this.supportService.deleteSupportRequest(support._id!).subscribe(() => {
          this.loadSupports();
          this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Support request deleted successfully.',
          });
        });
      },
    });
  }

  orderStatuses = [
    { label: 'Processing', value: 'processing' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  updateOrderStatus(order: Order): void {
    this.orderService.updateOrderStatus(order._id!, order.status).subscribe({
      next: () => {
        this.toastService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: `Order status updated to ${order.status}`,
        });
      },
      error: err => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update order status',
        });
      },
    });
  }

  onSearch(): void {
    const trimmedQuery = this.searchQuery.trim();

    if (trimmedQuery.length === 0) {
      this.toastService.add({
        severity: 'warn',
        summary: 'Invalid Search',
        detail: 'Please enter a valid search term.',
      });
      return;
    }

    switch (this.activeItem?.label) {
      case 'Files':
        this.fileService.searchFiles(trimmedQuery).subscribe(files => {
          this.files = files;
        });
        break;
      case 'Items':
        this.itemService.searchItems(trimmedQuery).subscribe(items => {
          this.items = items;
        });
        break;
      case 'Orders':
        this.orderService.searchOrders(trimmedQuery).subscribe(orders => {
          this.orders = orders;
        });
        break;
      case 'Support Requests':
        this.supportService
          .searchSupportRequests(trimmedQuery)
          .subscribe(supports => {
            this.supports = supports;
          });
        break;
      case 'Users':
        this.userService.searchUsers(trimmedQuery).subscribe(users => {
          this.users = users;
        });
        break;
    }
  }

  toCapitalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onTabChange(event: any): void {
    this.activeItem = event.item;
    this.searchQuery = '';
    this.onSearch();
  }

  onClear(): void {
    this.searchQuery = '';
    this.onSearch();
  }
}
