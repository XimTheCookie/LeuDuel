import { Component, computed, inject, signal } from '@angular/core';
import { DuelStore } from '../../stores/duel-store/duel.store';
import { LogItemComponent } from '../../components/core/log-item/log-item.component';
import { IconComponent } from '../../components/common/icon/icon.component';
import { SoundboardService } from '../../services/soundboard.service';

@Component({
  selector: 'app-logs-page',
  templateUrl: './logs-page.component.html',
  styleUrls: ['./logs-page.component.scss'],
  standalone: true,
  imports: [LogItemComponent, IconComponent],
})
export class LogsPageComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly dualStore = inject(DuelStore);

  undoCoolingDown = signal<boolean>(false);

  logs = computed(() => {
    const p1 = this.dualStore
      .player1()
      .lifeChanges.map((c) => ({ ...c, _player: 'player1' as const }));
    const p2 = this.dualStore
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
    if (entry?.undoable) this.dualStore.undoLifeChange(entry._player, timestamp);
  }
}
