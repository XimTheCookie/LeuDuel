import { Component, computed, inject } from '@angular/core';
import { TutorialService } from '../../../services/tutorial/tutorial.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';
import { TextButtonComponent } from '../text-button/text-button.component';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
  imports: [TranslatePipe, TextButtonComponent],
})
export class TutorialComponent {
  readonly tutorial = inject(TutorialService);
  readonly settings = inject(SettingsService);

  readonly positionClass = computed(() => {
    const landscape = this.settings.landscapeMode();
    const step = this.tutorial.currentStep();
    if (!step) return '';
    if (landscape) {
      return `tutorial-panel--${step.positionH}-ls`;
    }
    return `tutorial-panel--${step.positionV}`;
  });
}
