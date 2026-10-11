import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonComponent } from '../../components/common/button/button.component';
import { InfoModalComponent } from '../../components/common/info-modal/info-modal.component';
import { ListPickerComponent } from '../../components/common/list-picker/list-picker.component';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { TextButtonComponent } from '../../components/common/text-button/text-button.component';
import { TranslatePipe } from '../../pipes/translate/translate.pipe';
import { ModalService } from '../../services/modal/modal.service';
import {
  BEHAVIOURS_CONFIG,
  BehaviourSettingsService,
} from '../../services/settings/behaviour-settings.service';
import { SoundboardService } from '../../services/soundboard/soundboard.service';
import { TranslateService } from '../../services/translate/translate.service';

@Component({
  selector: 'app-behaviour-settings-page',
  templateUrl: './behaviour-settings-page.component.html',
  styleUrls: ['./behaviour-settings-page.component.scss'],
  standalone: true,
  imports: [TextButtonComponent, TranslatePipe, ListPickerComponent, ButtonComponent],
})
export class BehaviourSettingsPageComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly service = inject(BehaviourSettingsService);
  private readonly modalData = inject(MODAL_DATA);
  private readonly translateService = inject(TranslateService);
  private readonly modalService = inject(ModalService);

  readonly configs = BEHAVIOURS_CONFIG;

  allConfigKeys = Object.keys(this.configs) as (keyof typeof BEHAVIOURS_CONFIG)[];

  counterReset = new FormControl<number>(this.service.counterReset(), { nonNullable: true });
  gameReset = new FormControl<number>(this.service.gameReset(), { nonNullable: true });
  winnerSelect = new FormControl<number>(this.service.winnerSelect(), { nonNullable: true });
  matchStop = new FormControl<number>(this.service.matchStop(), { nonNullable: true });
  onStartup = new FormControl<number>(this.service.onStartup(), { nonNullable: true });

  getOptionConfig(configKey: string) {
    return this.configs[configKey];
  }

  getFormControlForConfig(configKey: string) {
    switch (configKey) {
      case 'counterReset':
        return this.counterReset;
      case 'gameReset':
        return this.gameReset;
      case 'winnerSelect':
        return this.winnerSelect;
      case 'matchStop':
        return this.matchStop;
      case 'onStartup':
        return this.onStartup;
      default:
        throw new Error(`Unknown config key: ${configKey}`);
    }
  }

  settingsChanged() {
    return (
      this.counterReset.value !== this.service.counterReset() ||
      this.gameReset.value !== this.service.gameReset() ||
      this.winnerSelect.value !== this.service.winnerSelect() ||
      this.onStartup.value !== this.service.onStartup() ||
      this.matchStop.value !== this.service.matchStop()
    );
  }

  settingsValid() {
    return (
      this.counterReset.valid &&
      this.gameReset.valid &&
      this.winnerSelect.valid &&
      this.onStartup.valid &&
      this.matchStop.valid
    );
  }

  confirm() {
    if (!this.settingsChanged() || !this.settingsValid()) return;
    this.soundboardService.confirmationSound();
    this.service.counterReset.set(this.counterReset.value);
    this.service.gameReset.set(this.gameReset.value);
    this.service.winnerSelect.set(this.winnerSelect.value);
    this.service.matchStop.set(this.matchStop.value);
    this.service.onStartup.set(this.onStartup.value);
    this.modalData.overlayRef.dispose();
  }

  info(helper: string) {
    if (!helper) return;
    this.soundboardService.clickSound();
    this.modalService.open(
      InfoModalComponent,
      {
        size: 'sm',
      },
      { info: this.translateService.translate(helper) },
    );
  }
}
