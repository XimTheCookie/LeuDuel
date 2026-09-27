import { Component, computed, inject, input, signal } from '@angular/core';
import { ToolsStore } from '../../../stores/tools-store/tools.store';
import { SettingsService } from '../../../services/settings/settings.service';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

@Component({
  selector: 'app-player-tools',
  standalone: true,
  templateUrl: './player-tools.component.html',
  styleUrls: ['./player-tools.component.scss'],
  imports: [TranslatePipe],
})
export class PlayerToolsComponent {
  toolsStore = inject(ToolsStore);
  private readonly soundboardService = inject(SoundboardService);
  settingsService = inject(SettingsService);

  player = input.required<1 | 2>();

  diceRolls = computed(() => {
    return this.player() === 1 ? this.toolsStore.player1rolls() : this.toolsStore.player2rolls();
  });

  coinFlips = computed(() => {
    return this.player() === 1 ? this.toolsStore.player1coins() : this.toolsStore.player2coins();
  });

  diceAnimTick = signal(0);
  coinAnimTick = signal(0);
  coolingDown = signal(false);

  private withCooldown(fn: () => void) {
    if (this.coolingDown()) return;
    fn();
    this.coolingDown.set(true);
    setTimeout(() => this.coolingDown.set(false), 50);
  }

  rollDice() {
    this.withCooldown(() => {
      this.soundboardService.diceRollSound();
      this.toolsStore.diceRoll(this.player());
      this.diceAnimTick.update((v) => v + 1);
    });
  }

  flipCoin() {
    this.withCooldown(() => {
      this.soundboardService.coinFlipSound();
      this.toolsStore.coinFlip(this.player());
      this.coinAnimTick.update((v) => v + 1);
    });
  }
}
