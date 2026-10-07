import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Inject, inject, Type } from '@angular/core';
import { ModalConfig } from '../../../services/modal/modal.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { MODAL_DATA } from '../../common/modal-generic/modal-generic.component';
import { FormControl } from '@angular/forms';
import { ListPickerComponent } from '../../common/list-picker/list-picker.component';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

@Component({
  selector: 'welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss'],
  standalone: true,
  imports: [ListPickerComponent, TranslatePipe],
})
export class WelcomeModalComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly settingsService = inject(SettingsService);

  theme = new FormControl<string>(this.settingsService.theme());

  readonly themeOptions = [
    { label: 'settings.list-value.theme.light', value: 'light' },
    { label: 'settings.list-value.theme.dark', value: 'dark' },
    { label: 'settings.list-value.theme.high-contrast', value: 'high-contrast' },
  ];

  constructor(
    @Inject(MODAL_DATA)
    private readonly modalData: {
      component: Type<unknown>;
      config: ModalConfig;
      overlayRef: OverlayRef;
    },
  ) {}

  onThemeChanged() {
    this.soundboardService.clickSound();
    this.settingsService.setTheme(this.theme.value!);
    this.modalData.overlayRef.dispose();
  }
}
