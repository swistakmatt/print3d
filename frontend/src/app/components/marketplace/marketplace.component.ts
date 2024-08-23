import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ItemService } from '../../services/item.service';
import Item from '../../types/Item';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    ImageModule,
    DividerModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {
  layout: 'grid' | 'list' = 'list';

  items: Item[] = [];
  selectedItem: Item | null = null;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getPublicItems().subscribe((items: Item[]) => {
      this.items = items;
    });
  }
}
