import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoginComponent } from '../dialogs/login/login.component';
import { RegisterComponent } from '../dialogs/register/register.component';
import { MenubarService } from '../../services/menubar.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/User';
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
  selector: 'app-menubar',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    MenuModule,
    PanelMenuModule,
    ConfirmDialogModule,
    LoginComponent,
    RegisterComponent,
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss',
})
export class MenubarComponent implements OnInit {
  loginDialogVisible: boolean = false;
  registerDialogVisible: boolean = false;

  currentUser?: User | null;

  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private toastService: MessageService,
    private menubarService: MenubarService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.menubarService.loginDialogVisible$.subscribe(visible => {
      this.loginDialogVisible = visible;
    });
    this.menubarService.registerDialogVisible$.subscribe(visible => {
      this.registerDialogVisible = visible;
    });

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/',
      },
      {
        label: 'Files',
        icon: 'pi pi-folder',
        route: '/files',
      },
      {
        label: 'Items',
        icon: 'pi pi-box',
        route: '/items',
      },
      {
        label: 'Marketplace',
        icon: 'pi pi-shopping-cart',
        route: '/marketplace',
      },
      // {
      //   label: 'Projects',
      //   icon: 'pi pi-search',
      //   items: [
      //     {
      //       label: 'UI Kit',
      //       icon: 'pi pi-pencil',
      //     },
      //     {
      //       label: 'Templates',
      //       icon: 'pi pi-palette',
      //       items: [
      //         {
      //           label: 'Apollo',
      //           icon: 'pi pi-palette',
      //         },
      //         {
      //           label: 'Ultima',
      //           icon: 'pi pi-palette',
      //         },
      //       ],
      //     },
      //   ],
      // },
    ];
  }

  showLoginDialog(): void {
    this.menubarService.toggleLoginDialog();
  }

  showRegisterDialog(): void {
    this.menubarService.toggleRegisterDialog();
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
