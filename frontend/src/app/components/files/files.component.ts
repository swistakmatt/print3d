import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileService } from '../../services/file.service';
import { UploadComponent } from '../dialogs/upload/upload.component';
import { File } from '../../types/File';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    FileUploadModule,
    UploadComponent,
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
})
export class FilesComponent implements OnInit {
  @ViewChild(UploadComponent) uploadDialog!: UploadComponent;

  files: File[] = [];
  selectedFiles: File[] = [];

  constructor(
    private fileService: FileService,
    private confirmationService: ConfirmationService,
    private toastService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.searchFilesByOwnerId().subscribe(files => {
      this.files = files;
    });
  }

  openPreview(file: File): void {
    const stlFileUrl = this.fileService.getFileDownloadUrl(file._id);
    this.router.navigate(['/stl-preview'], {
      queryParams: {
        url: stlFileUrl,
        fileId: file._id,
        ownerId: file.metadata.ownerId,
      },
    });
  }

  downloadFile(file: File): void {
    this.fileService.downloadFile(file._id).subscribe({
      next: response => {
        const blob = new Blob([response], { type: response.type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        this.toastService.add({
          severity: 'success',
          summary: 'Download Successful',
          detail: `The file "${file.filename}" has been downloaded successfully.`,
        });
      },
      error: err => {
        console.error('Download error:', err);

        this.toastService.add({
          severity: 'error',
          summary: 'Download Failed',
          detail: `Failed to download the file "${file.filename}". Please try again later.`,
        });
      },
    });
  }

  deleteFile(file: File): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete that file?`,
      accept: () => {
        this.fileService.deleteFile(file._id).subscribe({
          next: () => {
            this.toastService.add({
              severity: 'success',
              summary: 'Delete Successful',
              detail: `The file "${file.filename}" has been deleted successfully.`,
            });

            this.loadFiles();
          },
          error: err => {
            console.error('Delete error:', err);

            this.toastService.add({
              severity: 'error',
              summary: 'Delete Failed',
              detail: `Failed to delete the file "${file.filename}". Please try again later.`,
            });
          },
        });
      },
    });
  }

  openUploadDialog(): void {
    this.uploadDialog.openDialog();
  }
}
