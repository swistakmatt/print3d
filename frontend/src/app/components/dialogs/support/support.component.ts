import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupportService } from '../../../services/support.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import SupportRequest from '../../../types/SupportRequest';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
  ],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
})
export class SupportComponent implements OnInit {
  visible: boolean = false;
  email: string = '';
  title: string = '';
  message: string = '';

  constructor(
    private supportService: SupportService,
    private authService: AuthService,
    private toastService: MessageService
  ) {}

  ngOnInit(): void {
    this.populateEmail();
  }

  openDialog(): void {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
  }

  submitSupportRequest(): void {
    if (!this.email || !this.title || !this.message) {
      this.toastService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'All fields are required.',
      });
      return;
    }

    const supportRequest: SupportRequest = {
      email: this.email,
      title: this.title,
      message: this.message,
      userId: this.authService.currentUserValue?.userId ?? '',
    };

    this.supportService.submitSupportRequest(supportRequest).subscribe({
      next: response => {
        this.toastService.add({
          severity: 'success',
          summary: 'Request Submitted',
          detail: 'Your support request has been submitted successfully.',
        });
        this.closeDialog();
        this.clearForm();
      },
      error: err => {
        this.toastService.add({
          severity: 'error',
          summary: 'Submission Failed',
          detail: 'There was an issue submitting your support request.',
        });
      },
    });
  }

  private populateEmail(): void {
    if (this.authService.currentUserValue) {
      this.email = this.authService.currentUserValue?.email || '';
    }
  }

  clearForm(): void {
    this.email = '';
    this.title = '';
    this.message = '';
  }
}
