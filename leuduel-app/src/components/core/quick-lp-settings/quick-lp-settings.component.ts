import { AfterViewInit, Component, inject, output, viewChild } from '@angular/core';
import { ListPickerComponent } from '../../common/list-picker/list-picker.component';
import { FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../../../services/settings/settings.service';
import { DuelStore } from '../../../stores/duel-store/duel.store';

@Component({
  selector: 'app-quick-lp-settings',
  templateUrl: './quick-lp-settings.component.html',
  styleUrls: ['./quick-lp-settings.component.scss'],
  standalone: true,
  imports: [ListPickerComponent],
})
export class QuickLpSettingsComponent implements AfterViewInit {
  closed = output<void>();

  private settingsService = inject(SettingsService);
  private duelStore = inject(DuelStore);

  presetLpPicker = viewChild<ListPickerComponent>('presetLpPicker');

  lifePoints = new FormControl<number>(this.settingsService.getStartingLifePoints(), [
    Validators.required,
    Validators.min(1),
    Validators.max(9999999),
  ]);

  readonly presetLpOptions = [
    {
      label: '4000',
      value: 4000,
    },
    {
      label: '8000',
      value: 8000,
    },
    {
      label: '16000',
      value: 16000,
    },
    {
      label: '32000',
      value: 32000,
    },
    {
      label: '64000',
      value: 64000,
    },
    {
      label: '128000',
      value: 128000,
    },
    {
      label: '2000',
      value: 2000,
    },
    {
      label: '1',
      value: 1,
    },
    {
      label: '8',
      value: 8,
    },
  ];

  onLpChange() {
    const value = this.lifePoints.value;
    if (value !== null && value !== this.settingsService.getStartingLifePoints()) {
      this.settingsService.setStartingLifePoints(value);
      this.duelStore.reset();
    }
    this.closed.emit();
  }

  onLpClosed() {
    this.closed.emit();
  }

  ngAfterViewInit(): void {
    this.presetLpPicker()?.open();
  }
}
