import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileService } from '../../services/file.service';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CanvasBoxComponent } from '../canvas-box/canvas-box.component';
import { File } from '../../types/File';
import { User } from '../../types/User';

@Component({
  selector: 'app-stl-preview',
  standalone: true,
  imports: [
    CommonModule,
    CanvasBoxComponent,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './stl-preview.component.html',
  styleUrl: './stl-preview.component.scss',
})
export class StlPreviewComponent implements OnInit {
  stlFileUrl: string | null = null;
  fileId: string | null = null;
  ownerId: string | null = null;
  file: File | null = null;
  user: User | null = null;

  loadingFileDetails = false;
  loadingUser = false;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private userService: UserService,
    private toastService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.stlFileUrl = params['url'];
      this.fileId = params['fileId'];
      this.ownerId = params['ownerId'];
    });

    this.loadingFileDetails = true;
    this.loadingUser = true;

    if (this.fileId && this.ownerId) {
      this.loadUserDetails();
      this.loadFileDetails();
    }
  }

  loadFileDetails(): void {
    this.fileService.getFileById(this.fileId!).subscribe({
      next: file => {
        this.file = file;
        this.loadingFileDetails = false;
      },
      error: err => {
        console.error('Error loading file details:', err);

        this.toastService.add({
          severity: 'error',
          summary: 'File Load Failed',
          detail: 'Failed to load file details. Please try again later.',
        });
      },
    });
  }

  loadUserDetails(): void {
    this.userService.getUserById(this.ownerId!).subscribe({
      next: user => {
        this.user = user;
        this.loadingUser = false;
      },
      error: err => {
        console.error('Error loading user details:', err);

        this.toastService.add({
          severity: 'error',
          summary: 'User Load Failed',
          detail: 'Failed to load user details. Please try again later.',
        });
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
}
