import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  loginDialogVisible: boolean = false;
  registerDialogVisible: boolean = false;

  showLoginDialog(): void {
    this.loginDialogVisible = true;
  }

  showRegisterDialog(): void {
    this.registerDialogVisible = true;
  }
}
