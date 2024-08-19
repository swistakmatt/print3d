import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { HttpEventType } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { FileService } from '../../../services/file.service';
import { MessageService } from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FileUploadModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent {
  visible: boolean = false;

  fileSelected: boolean = false;

  constructor(
    private fileService: FileService,
    private toastService: MessageService
  ) {}

  onSelect(event: any): void {
    this.fileSelected = true;
  }

  uploadHandler(event: any): void {
    const files = event.files;

    if (files && files.length > 0) {
      const file = files[0];

      this.fileService.uploadFile(file).subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * event.loaded) / event.total!);
            this.toastService.add({
              severity: 'info',
              summary: 'Upload Progress',
              detail: `File is ${percentDone}% uploaded.`,
            });
          } else if (event.type === HttpEventType.Response) {
            this.toastService.add({
              severity: 'success',
              summary: 'Upload Successful',
              detail: `The file "${file.name}" has been uploaded successfully.`,
            });
            this.closeDialog();
          }
        },
        error: err => {
          console.error('Upload error:', err);
          this.toastService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: `Failed to upload the file "${file.name}".`,
          });
        },
      });
    }
  }

  openDialog(): void {
    this.visible = true;
    this.fileSelected = false;
  }

  closeDialog(): void {
    this.visible = false;
  }
}
