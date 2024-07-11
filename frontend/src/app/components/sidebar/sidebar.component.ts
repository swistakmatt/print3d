import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoginComponent } from '../dialogs/login/login.component';
import { RegisterComponent } from '../dialogs/register/register.component';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/User';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
  MenuItem,
} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    MenuModule,
    PanelMenuModule,
    ConfirmDialogModule,
    LoginComponent,
    RegisterComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  loginDialogVisible: boolean = false;
  registerDialogVisible: boolean = false;
  sidebarVisible: boolean = false;

  currentUser?: User | null;

  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private toastService: MessageService,
    private sidebarService: SidebarService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.sidebarService.loadSidebarState();
    this.sidebarService.sidebarVisible$.subscribe(visible => {
      this.sidebarVisible = visible;
    });
    this.sidebarService.loginDialogVisible$.subscribe(visible => {
      this.loginDialogVisible = visible;
    });
    this.sidebarService.registerDialogVisible$.subscribe(visible => {
      this.registerDialogVisible = visible;
    });
    this.items = [
      {
        label: 'Documents',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
          },
          {
            label: 'Search',
            icon: 'pi pi-search',
          },
        ],
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
          },
        ],
      },
    ];
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  showLoginDialog(): void {
    this.sidebarService.toggleLoginDialog();
  }

  showRegisterDialog(): void {
    this.sidebarService.toggleRegisterDialog();
  }

  navigateToMyOrders() {
    throw new Error('Method not implemented.');
  }
  navigateToMarketplace() {
    throw new Error('Method not implemented.');
  }

  logoutConfirm(event: Event): void {
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
