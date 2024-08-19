import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenubarService {
  constructor() {}

  private loginDialogVisibleSubject = new BehaviorSubject<boolean>(false);
  loginDialogVisible$ = this.loginDialogVisibleSubject.asObservable();

  private registerDialogVisibleSubject = new BehaviorSubject<boolean>(false);
  registerDialogVisible$ = this.registerDialogVisibleSubject.asObservable();

  toggleLoginDialog(): void {
    const currentState = this.loginDialogVisibleSubject.value;
    this.loginDialogVisibleSubject.next(!currentState);
  }

  toggleRegisterDialog(): void {
    const currentState = this.registerDialogVisibleSubject.value;
    this.registerDialogVisibleSubject.next(!currentState);
  }
}
