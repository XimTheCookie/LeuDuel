import { inject, Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class SoundboardService {
  private settingsService = inject(SettingsService);

  private play(src: string) {
    if (!this.settingsService.soundsOn()) {
      return;
    }
    const audio = new Audio(`audio/${src}`);
    audio.play();
  }

  confirmationSound() {
    this.play('confirm.wav');
  }
  clickSound() {
    this.play('click.wav');
  }
  alarmSound() {
    this.play('alarm.wav');
  }
  counterAdd() {
    this.play('counter_add.wav');
  }
  counterRemove() {
    this.play('counter_remove.wav');
  }
  lifePointsChange() {
    this.play('lp_change.wav');
  }
  lifePointsSet() {
    this.play('lp_set.wav');
  }
  lifePointsZero() {
    this.play('lp_zero.wav');
  }
  coinFlipSound() {
    this.play('coin_flip.wav');
  }
  diceRollSound() {
    this.play('dice_roll.wav');
  }
}
