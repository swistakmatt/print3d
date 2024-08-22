import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ItemService } from '../../services/item.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ItemComponent } from '../dialogs/item/item.component';
import Item from '../../types/Item';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    ItemComponent,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent implements OnInit {
  @ViewChild(ItemComponent) itemDialog!: ItemComponent;

  items: Item[] = [];
  selectedItems: Item[] = [];

  constructor(
    private itemService: ItemService,
    private toastService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.searchItemsByOwnerId().subscribe(items => {
      this.items = items;
    });
  }

  openCreateItemDialog(): void {
    this.itemDialog.open();
  }

  openEditItemDialog(item: Item): void {
    this.itemDialog.open(item);
  }

  deleteItem(item: Item): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${item.name}?`,
      accept: () => {
        this.itemService.deleteItem(item._id!).subscribe({
          next: () => {
            this.toastService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item deleted successfully.',
            });
            this.loadItems();
          },
          error: () => {
            this.toastService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Item could not be deleted.',
            });
          },
        });
      },
    });
  }
}
