import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  constructor() {}

  private sidebarVisibleSubject = new BehaviorSubject<boolean>(false);
  sidebarVisible$ = this.sidebarVisibleSubject.asObservable();

  private loginDialogVisibleSubject = new BehaviorSubject<boolean>(false);
  loginDialogVisible$ = this.loginDialogVisibleSubject.asObservable();

  private registerDialogVisibleSubject = new BehaviorSubject<boolean>(false);
  registerDialogVisible$ = this.registerDialogVisibleSubject.asObservable();

  toggleSidebar(): void {
    const currentState = this.sidebarVisibleSubject.value;
    this.sidebarVisibleSubject.next(!currentState);
    localStorage.setItem('sidebarVisible', String(!currentState));
  }

  loadSidebarState(): void {
    const sidebarState = localStorage.getItem('sidebarVisible');
    this.sidebarVisibleSubject.next(sidebarState === 'true');
  }

  toggleLoginDialog(): void {
    const currentState = this.loginDialogVisibleSubject.value;
    this.loginDialogVisibleSubject.next(!currentState);
  }

  toggleRegisterDialog(): void {
    const currentState = this.registerDialogVisibleSubject.value;
    this.registerDialogVisibleSubject.next(!currentState);
  }
}
