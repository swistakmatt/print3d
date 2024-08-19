import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CanvasBoxComponent } from '../canvas-box/canvas-box.component';
import { User } from '../../types/User';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CanvasBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  currentUser?: User | null;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }
}
