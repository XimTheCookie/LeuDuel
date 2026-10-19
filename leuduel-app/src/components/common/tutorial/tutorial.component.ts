import { AfterViewInit, Component, computed, inject, OnDestroy } from '@angular/core';
import { TutorialService } from '../../../services/tutorial/tutorial.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';
import { TextButtonComponent } from '../text-button/text-button.component';
import { AndroidNavigationService } from '../../../services/android/android-navigation.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
  imports: [TranslatePipe, TextButtonComponent],
})
export class TutorialComponent implements AfterViewInit, OnDestroy {
  readonly tutorial = inject(TutorialService);
  readonly settings = inject(SettingsService);
  private readonly androidNavigationService = inject(AndroidNavigationService);

  readonly positionClass = computed(() => {
    const landscape = this.settings.landscapeMode();
    const step = this.tutorial.currentStep();
    if (!step) return '';
    if (landscape) {
      return `tutorial-panel--${step.positionH}-ls`;
    }
    return `tutorial-panel--${step.positionV}`;
  });

  private unregister?: () => void;

  ngAfterViewInit(): void {
    this.unregister = this.androidNavigationService.register(() => this.goBack());
  }

  ngOnDestroy(): void {
    this.unregister?.();
  }

  goBack() {
    if (this.tutorial.currentStepIndex() === 0) {
      return;
    }
    this.tutorial.prevStep();
  }
}
