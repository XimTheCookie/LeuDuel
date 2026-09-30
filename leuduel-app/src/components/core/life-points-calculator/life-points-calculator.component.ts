import { Component, computed, inject, input, output, signal } from '@angular/core';
import { SettingsService } from '../../../services/settings/settings.service';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { LpcPreviewDefaultComponent } from './lpc-preview-default/lpc-preview-default.component';
import { LpcPreviewNmuComponent } from './lpc-preview-nmu/lpc-preview-nmu.component';

type Op = 'damage' | 'heal';

@Component({
  selector: 'app-life-points-calculator',
  templateUrl: './life-points-calculator.component.html',
  styleUrls: ['./life-points-calculator.component.scss'],
  standalone: true,
  imports: [LpcPreviewDefaultComponent, LpcPreviewNmuComponent],
})
export class LifePointsCalculatorComponent {
  private readonly soundboardService = inject(SoundboardService);
  readonly settingsService = inject(SettingsService);
  duelStore = inject(DuelStore);

  player = input.required<'player1' | 'player2'>();
  applied = output<void>();

  input = signal('0');
  op = signal<Op>('damage');
  private coolingDown = false;
  private halveMode = false;

  playerName = () => {
    const player = this.duelStore[this.player()]();
    if (this.settingsService.showCustomPlayers()) {
      return player.profile?.displayName ?? player.name;
    }
    return player.name ?? '';
  };

  notModalUse = computed(() => this.settingsService.useRapidButtons() === false);

  currentLp = computed(() =>
    this.player() === 'player1' ? this.duelStore.lifePoints1() : this.duelStore.lifePoints2(),
  );

  preview = computed(() => {
    const val = parseInt(this.input(), 10) || 0;
    const lp = this.currentLp();
    return this.op() === 'heal' ? Math.min(99999999, lp + val) : Math.max(0, lp - val);
  });

  private withCooldown(fn: () => void) {
    if (this.coolingDown) return;
    this.coolingDown = true;
    setTimeout(() => (this.coolingDown = false), 50);

    fn();
  }

  pressDigit(d: string) {
    this.withCooldown(() => {
      this.removeHalveMode();
      this.input.update((v) => {
        const next = v === '0' ? d : v + d;
        return next.length > 8 ? v : next;
      });
    });
  }

  pressZeros(zeros: string) {
    this.withCooldown(() => {
      this.removeHalveMode();
      this.input.update((v) => {
        if (v === '0') return v;
        const next = v + zeros;
        return next.length > 8 ? v : next;
      });
    });
  }

  clear() {
    this.withCooldown(() => {
      this.removeHalveMode();
      this.input.set('0');
    });
  }

  setOp(op: Op) {
    this.withCooldown(() => {
      this.op.set(op);
    });
  }

  halfLp() {
    this.withCooldown(() => {
      this.op.set('damage');
      this.input.set(String(Math.floor(this.currentLp() / 2)));
      this.halveMode = true;
    });
  }

  removeHalveMode() {
    if (this.halveMode) {
      this.input.set('0');
      this.halveMode = false;
    }
  }

  apply() {
    const val = parseInt(this.input(), 10) || 0;
    if (val > 0) {
      this.duelStore.lifeAction(this.player(), { change: val, type: this.op() });
    }
    this.soundboardService.confirmationSound();
    this.clear();
    this.op.set('damage');
    this.applied.emit();
  }
}
