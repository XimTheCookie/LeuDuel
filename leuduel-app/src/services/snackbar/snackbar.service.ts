import { Injectable, signal } from '@angular/core';

interface Snackbar {
  message: string;
  type: 'neutral' | 'error' | 'warning' | 'success';
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbars: Snackbar[] = [];
  current = signal<Snackbar | null>(null);

  private popTimeout: number | null = null;

  private popQueue() {
    if (this.popTimeout) return;
    const snackbar = this.snackbars.shift();
    if (!snackbar) {
      this.current.set(null);
      return;
    }
    this.current.set(snackbar);
    this.popTimeout = window.setTimeout(() => {
      this.popTimeout = null;
      this.popQueue();
    }, 3000);
  }

  showMessage(message: string, type: 'neutral' | 'error' | 'warning' | 'success') {
    this.snackbars.push({ message, type });
    this.popQueue();
  }

  showNeutral(message: string) {
    this.showMessage(message, 'neutral');
  }

  showError(message: string) {
    this.showMessage(message, 'error');
  }

  showWarning(message: string) {
    this.showMessage(message, 'warning');
  }

  showSuccess(message: string) {
    this.showMessage(message, 'success');
  }
}
