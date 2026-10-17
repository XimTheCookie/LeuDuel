import { Component, Inject, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SettingsService } from '../../../services/settings/settings.service';
import {
  MODAL_DATA,
  ModalGenericComponent,
} from '../../common/modal-generic/modal-generic.component';
import { ListPickerComponent } from '../../common/list-picker/list-picker.component';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';
import { TutorialService } from '../../../services/tutorial/tutorial.service';

@Component({
  selector: 'welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss'],
  standalone: true,
  imports: [ListPickerComponent, TextButtonComponent, TranslatePipe],
})
export class WelcomeModalComponent {
  private readonly tutorialService = inject(TutorialService);
  private readonly soundboardService = inject(SoundboardService);
  private readonly settingsService = inject(SettingsService);

  theme = new FormControl<string>(this.settingsService.theme());
  language = new FormControl<string>(this.settingsService.language());

  readonly themeOptions = [
    { label: 'settings.list-value.theme.light', value: 'light' },
    { label: 'settings.list-value.theme.dark', value: 'dark' },
    { label: 'settings.list-value.theme.high-contrast', value: 'high-contrast' },
  ];

  readonly languageOptions = [
    { label: 'English', value: 'en_GB' },
    { label: 'Italiano', value: 'it_IT' },
    { label: 'Español', value: 'es_ES' },
    { label: 'Français', value: 'fr_FR' },
    { label: 'Polski', value: 'pl_PL' },
    { label: 'Deutsch', value: 'de_DE' },
  ];

  constructor(
    @Inject(MODAL_DATA)
    private readonly modalData: InstanceType<typeof ModalGenericComponent>['data'],
  ) {}

  onThemeChanged() {
    this.soundboardService.clickSound();
    this.settingsService.setTheme(this.theme.value!);
  }

  onLanguageChanged() {
    this.soundboardService.clickSound();
    this.settingsService.setLanguage(this.language.value!);
  }

  close() {
    this.soundboardService.clickSound();
    this.modalData.overlayRef.dispose();
  }

  viewGuide() {
    this.soundboardService.clickSound();
    this.modalData.overlayRef.dispose();
    this.tutorialService.startTutorial();
  }
}
