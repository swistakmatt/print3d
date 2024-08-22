import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../../services/file.service';
import { ItemService } from '../../../services/item.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import Item from '../../../types/Item';
import { File } from '../../../types/File';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToggleButtonModule,
    TableModule,
    FormsModule,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input() item?: Item;
  @Output() onItemSaved: EventEmitter<void> = new EventEmitter<void>();

  itemCopy: Item = {} as Item;

  visible: boolean = false;
  isEditMode: boolean = false;
  isPriceEnabled: boolean = false;
  canSetPrice: boolean = false;
  files: File[] = [];
  selectedFileIds: string[] = [];

  categories: string[] = ['Tools', 'Materials', 'Parts', 'Accessories'];

  constructor(
    private fileService: FileService,
    private itemService: ItemService,
    private authService: AuthService,
    private toastService: MessageService
  ) {}

  saveItem(): void {
    this.itemCopy.files = this.selectedFileIds;
    if (this.isEditMode) {
      this.itemService.updateItem(this.itemCopy._id!, this.itemCopy).subscribe({
        next: () => {
          this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item updated',
          });
          this.onItemSaved.emit();
          this.close();
        },
        error: () => {
          this.toastService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Item update failed',
          });
        },
      });
    } else {
      this.itemService.createItem(this.itemCopy).subscribe({
        next: () => {
          this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item created',
          });
          this.onItemSaved.emit();
          this.close();
        },
        error: () => {
          this.toastService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Item creation failed',
          });
        },
      });
    }
  }

  onFileSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.fileService.filterUserFiles(query).subscribe(files => {
      this.files = files;
      this.updateSelectedFiles();
    });
  }

  loadFiles(): void {
    this.fileService.searchFilesByOwnerId().subscribe(files => {
      this.files = files;
      this.selectedFileIds = this.itemCopy.files.filter(id =>
        this.files.some(file => file._id === id)
      );
    });
  }

  updateSelectedFiles(): void {
    if (this.isEditMode && this.itemCopy.files) {
      this.selectedFileIds = this.itemCopy.files;
    }

    this.selectedFileIds = this.selectedFileIds.filter(fileId =>
      this.files.some(file => file._id === fileId)
    );
  }

  open(item?: Item): void {
    this.visible = true;
    this.canSetPrice = this.authService.currentUserValue?.admin === true;

    if (item) {
      this.isEditMode = true;
      this.itemCopy = { ...item };
      this.selectedFileIds = [...item.files];
    } else {
      this.isEditMode = false;
      this.itemCopy = {} as Item;
      this.selectedFileIds = [];
    }
    this.loadFiles();
  }

  close(): void {
    this.visible = false;
    this.itemCopy = {} as Item;
    this.selectedFileIds = [];
  }
}
