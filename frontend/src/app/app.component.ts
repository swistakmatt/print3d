import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenubarComponent } from './components/menubar/menubar.component';
import { SupportComponent } from './components/dialogs/support/support.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenubarComponent,
    SupportComponent,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(SupportComponent) supportDialog!: SupportComponent;

  title = 'print3d';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  showSupportDialog(): void {
    this.supportDialog.openDialog();
  }
}
