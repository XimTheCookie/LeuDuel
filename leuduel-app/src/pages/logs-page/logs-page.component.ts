import { Component, computed, inject, signal } from '@angular/core';
import { IconComponent } from '../../components/common/icon/icon.component';
import { LogItemComponent } from '../../components/core/log-item/log-item.component';
import { SoundboardService } from '../../services/soundboard/soundboard.service';
import { DuelStore } from '../../stores/duel-store/duel.store';
import { SettingsService } from '../../services/settings/settings.service';
import { TranslatePipe } from '../../pipes/translate/translate.pipe';

@Component({
  selector: 'app-logs-page',
  templateUrl: './logs-page.component.html',
  styleUrls: ['./logs-page.component.scss'],
  standalone: true,
  imports: [LogItemComponent, IconComponent, TranslatePipe],
})
export class LogsPageComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly duelStore = inject(DuelStore);
  private readonly settingsService = inject(SettingsService);

  playerProfile1 = computed(() => {
    if (!this.settingsService.showCustomPlayers()) return undefined;
    return this.duelStore.player1()?.profile;
  });
  playerProfile2 = computed(() => {
    if (!this.settingsService.showCustomPlayers()) return undefined;
    return this.duelStore.player2()?.profile;
  });

  undoCoolingDown = signal<boolean>(false);

  logs = computed(() => {
    const p1 = this.duelStore
      .player1()
      .lifeChanges.map((c) => ({ ...c, _player: 'player1' as const }));
    const p2 = this.duelStore
      .player2()
      .lifeChanges.map((c) => ({ ...c, _player: 'player2' as const }));
    const all = [...p1, ...p2].sort((a, b) => b.timestamp - a.timestamp);

    const lastResetTs: Record<string, number> = {
      player1: Math.max(0, ...p1.filter((c) => c.isReset).map((c) => c.timestamp)),
      player2: Math.max(0, ...p2.filter((c) => c.isReset).map((c) => c.timestamp)),
    };

    return all.map((c) => ({
      ...c,
      undoable: c.timestamp >= (lastResetTs[c._player] ?? 0),
    }));
  });

  undoChange(timestamp: number): void {
    if (this.undoCoolingDown()) return;
    this.soundboardService.clickSound();
    this.undoCoolingDown.set(true);
    setTimeout(() => this.undoCoolingDown.set(false), 300);
    const entry = this.logs().find((l) => l.timestamp === timestamp);
    if (entry?.undoable) this.duelStore.undoLifeChange(entry._player, timestamp);
  }
}
