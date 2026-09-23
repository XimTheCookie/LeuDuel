import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BEHAVIOURS_CONFIG,
  BehaviourSettingsService,
} from '../../services/behaviour-settings.service';
import { SelectSettingComponent } from '../../components/common/select-setting/select-setting.component';
import { TextButtonComponent } from '../../components/common/text-button/text-button.component';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { SoundboardService } from '../../services/soundboard.service';

@Component({
  selector: 'app-behaviour-settings-page',
  templateUrl: './behaviour-settings-page.component.html',
  styleUrls: ['./behaviour-settings-page.component.scss'],
  standalone: true,
  imports: [SelectSettingComponent, TextButtonComponent],
})
export class BehaviourSettingsPageComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly service = inject(BehaviourSettingsService);
  private readonly modalData = inject(MODAL_DATA);

  readonly configs = BEHAVIOURS_CONFIG;

  counterReset = new FormControl<number>(this.service.counterReset(), { nonNullable: true });
  gameReset = new FormControl<number>(this.service.gameReset(), { nonNullable: true });
  winnerSelect = new FormControl<number>(this.service.winnerSelect(), { nonNullable: true });

  settingsChanged() {
    return (
      this.counterReset.value !== this.service.counterReset() ||
      this.gameReset.value !== this.service.gameReset() ||
      this.winnerSelect.value !== this.service.winnerSelect()
    );
  }

  settingsValid() {
    return this.counterReset.valid && this.gameReset.valid && this.winnerSelect.valid;
  }

  confirm() {
    if (!this.settingsChanged() || !this.settingsValid()) return;
    this.soundboardService.confirmationSound();
    this.service.counterReset.set(this.counterReset.value);
    this.service.gameReset.set(this.gameReset.value);
    this.service.winnerSelect.set(this.winnerSelect.value);
    this.modalData.overlayRef.dispose();
  }
}
