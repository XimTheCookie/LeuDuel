import { Component, inject, signal } from '@angular/core';
import { DuelPageComponent } from '../pages/duel-page/duel-page.component';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { AndroidManagementService } from '../services/android-management.service';

@Component({
  imports: [DuelPageComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('leuduel-app');

  private readonly androidManagementService = inject(AndroidManagementService);

  constructor() {
    this.androidManagementService.setStatusBarDark();
  }
}
