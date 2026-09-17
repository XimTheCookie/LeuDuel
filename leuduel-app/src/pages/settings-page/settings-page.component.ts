import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ButtonComponent } from '../../components/common/button/button.component';
import { NumberInputComponent } from '../../components/common/number-input/number-input.component';
import { TimeInputComponent } from '../../components/common/time-input/time-input.component';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  imports: [NumberInputComponent, TimeInputComponent, ButtonComponent],
})
export class SettingsPageComponent {
  private readonly settingsService = inject(SettingsService);

  lifePoints = new FormControl<number>(this.settingsService.getStartingLifePoints(), [
    Validators.required,
    Validators.min(1),
    Validators.max(9999999),
  ]);

  bestOf = new FormControl<number>(this.settingsService.getNumberOfGames(), [
    Validators.required,
    Validators.min(1),
    Validators.max(9),
  ]);

  duration = new FormControl<number>(this.settingsService.getDuelDuration(), [
    Validators.required,
    Validators.min(300000),
    Validators.max(86400000),
  ]);

  lpReset() {
    this.lifePoints.setValue(this.settingsService.getStartingLifePoints());
  }

  resetBestOf() {
    this.bestOf.setValue(this.settingsService.getNumberOfGames());
  }

  resetTimer() {
    this.duration.setValue(this.settingsService.getDuelDuration());
  }

  duelSettingsUnchanged() {
    return (
      this.lifePoints.value === this.settingsService.getStartingLifePoints() &&
      this.duration.value === this.settingsService.getDuelDuration() &&
      this.bestOf.value === this.settingsService.getNumberOfGames()
    );
  }

  duelSettingsValid() {
    return this.lifePoints.valid && this.duration.valid && this.bestOf.valid;
  }

  saveDuelSettings() {
    if (!this.duelSettingsValid()) {
      return;
    }
    this.settingsService.setStartingLifePoints(this.lifePoints.value!);
    this.settingsService.setDuelDuration(this.duration.value!);
    this.settingsService.setNumberOfGames(this.bestOf.value!);
  }
}
