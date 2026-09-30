import { Component, effect, inject } from '@angular/core';
import { take } from 'rxjs';
import { WelcomeModalComponent } from '../components/core/welcome-modal/welcome-modal.component';
import { AndroidManagementService } from '../services/android/android-management.service';
import { ModalService } from '../services/modal/modal.service';
import { SettingsService } from '../services/settings/settings.service';
import { WrapperComponent } from '../components/core/wrapper/wrapper.component';

@Component({
  imports: [WrapperComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly modalService = inject(ModalService);
  private readonly androidManagementService = inject(AndroidManagementService);
  private readonly settingsService = inject(SettingsService);

  constructor() {
    this.androidManagementService.hideStatusBar(true);
    effect(() => {
      this.androidManagementService.setOrientation(this.settingsService.landscapeMode());
    });

    this.settingsService.settingsInitialized.pipe(take(1)).subscribe(() => {
      if (this.settingsService.firstVisit()) {
        this.modalService.open(WelcomeModalComponent, {
          size: 'sm',
          opacity: this.settingsService.getModalOpacity(),
        });
        this.settingsService.setFirstVisitDone();
      }
    });
  }
}
