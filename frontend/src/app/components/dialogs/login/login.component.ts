import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/User';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DividerModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private toastService: MessageService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(12),
      ]),
      permanentJwt: new FormControl<boolean>(false),
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password, permanentJwt } = this.loginForm.value;
      this.authService.login(username, password, permanentJwt).subscribe({
        next: user => {
          this.toastService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'You are now logged in!',
          });
          this.closeDialog();
        },
        error: error => {
          this.toastService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail:
              error.error.message ||
              'Unknown error occurred. Please try again.',
          });
        },
      });
    } else {
      this.toastService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check your entries.',
      });
    }
  }
}
