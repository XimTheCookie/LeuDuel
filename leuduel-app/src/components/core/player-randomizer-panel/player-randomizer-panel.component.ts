import { Component, inject, output, signal } from '@angular/core';
import { RandomService } from '../../../services/random/random.service';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

const COLS = 9;
const ROWS = 9;

@Component({
  selector: 'app-player-randomizer-panel',
  templateUrl: './player-randomizer-panel.component.html',
  styleUrls: ['./player-randomizer-panel.component.scss'],
  standalone: true,
  imports: [TranslatePipe],
})
export class PlayerRandomizerPanelComponent {
  private readonly randomService = inject(RandomService);

  grid = signal<boolean[][]>(Array.from({ length: COLS }, () => Array(ROWS).fill(false)));

  completed = output<void>();
  done = signal(false);

  public triggerEvent(eventType: 'add' | 'remove'): void {
    const col = this.randomService.randomInt(0, COLS - 1);

    this.grid.update((g) => {
      const next = g.map((c) => [...c]);
      const col_ = next[col];

      if (eventType === 'add') {
        // abilito la prima cella OFF dalla base
        const row = this.lastOffRow(col_);
        if (row !== -1) col_[row] = true;
      } else {
        // disabilito la prima cella ON dalla cima
        const row = this.firstOnRow(col_);
        if (row !== -1) col_[row] = false;
      }

      return next;
    });

    if (this.grid().every((col) => col.every((cell) => cell))) {
      this.done.set(true);
      this.completed.emit();
    }
  }

  private lastOffRow(col: boolean[]): number {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!col[r]) return r;
    }
    return -1;
  }

  private firstOnRow(col: boolean[]): number {
    for (let r = 0; r < ROWS; r++) {
      if (col[r]) return r;
    }
    return -1;
  }

  readonly rows = Array.from({ length: ROWS }, (_, i) => i);
  readonly cols = Array.from({ length: COLS }, (_, i) => i);
}
