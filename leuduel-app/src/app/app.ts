import { Component, effect, inject, signal } from '@angular/core';
import { DuelPageComponent } from '../pages/duel-page/duel-page.component';
import { AndroidManagementService } from '../services/android-management.service';
import { SettingsService } from '../services/settings.service';

@Component({
  imports: [DuelPageComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('leuduel-app');

  private readonly androidManagementService = inject(AndroidManagementService);
  private readonly settingsService = inject(SettingsService);

  constructor() {
    this.androidManagementService.setStatusBarDark();
    effect(() => {
      this.androidManagementService.setOrientation(this.settingsService.landscapeMode());
    });
  }
}
