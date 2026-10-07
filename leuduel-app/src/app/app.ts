import { AfterViewInit, Component, effect, inject } from '@angular/core';
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
export class App implements AfterViewInit {
  private readonly modalService = inject(ModalService);
  private readonly androidManagementService = inject(AndroidManagementService);
  private readonly settingsService = inject(SettingsService);

  constructor() {
    effect(() => {
      this.androidManagementService.setOrientation(this.settingsService.landscapeMode());
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.settingsService.firstVisit()) {
        this.modalService.open(WelcomeModalComponent, {
          size: 'sm',
          opacity: this.settingsService.getModalOpacity(),
        });
        this.settingsService.setFirstVisitDone();
      }
    }, 500);
  }
}
