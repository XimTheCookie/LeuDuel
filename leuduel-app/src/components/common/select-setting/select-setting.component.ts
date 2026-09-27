import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { ModalService } from '../../../services/modal/modal.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';
import { TranslateService } from '../../../services/translate/translate.service';

@Component({
  selector: 'app-select-setting',
  templateUrl: './select-setting.component.html',
  styleUrls: ['./select-setting.component.scss'],
  standalone: true,
  imports: [TranslatePipe],
})
export class SelectSettingComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly modalService = inject(ModalService);
  private readonly settingsService = inject(SettingsService);
  private readonly translateService = inject(TranslateService);
  control = input.required<FormControl<number>>();
  config = input.required<{ labels: string[]; helper: string }>();
  label = input<string>('');
  defaultValue = input<number>(0);

  select(index: number) {
    this.soundboardService.counterSound();
    this.control().setValue(index);
  }

  reset() {
    this.soundboardService.clickSound();
    this.control().setValue(this.defaultValue());
  }

  info() {
    this.soundboardService.clickSound();
    this.modalService.open(
      InfoModalComponent,
      {
        size: 'sm',
        opacity: this.settingsService.getModalOpacity(),
      },
      { info: this.translateService.translate(this.config().helper) },
    );
  }
}
