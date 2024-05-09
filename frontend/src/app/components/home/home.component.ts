import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { CanvasBoxComponent } from '../canvas-box/canvas-box.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/User';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    CanvasBoxComponent,
    ButtonModule,
    ToastModule,
    SidebarModule,
    ConfirmDialogModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  loginDialogVisible: boolean = false;
  registerDialogVisible: boolean = false;
  sidebarVisible: boolean = false;

  currentUser?: User | null;

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private toastService: MessageService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  showLoginDialog(): void {
    this.loginDialogVisible = !this.loginDialogVisible;
  }

  showRegisterDialog(): void {
    this.registerDialogVisible = !this.registerDialogVisible;
  }

  showSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logoutConfirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.logout();
      },
    });
  }

  logout(): void {
    this.toastService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Logged out successfully!',
    });
    this.authService.logout();
  }
}
