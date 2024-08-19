import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToolbarModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ItemsComponent initialized');
  }
}
