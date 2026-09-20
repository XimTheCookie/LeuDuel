import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { SoundboardService } from '../../../services/soundboard.service';

const ANIM_DURATION = 1500;

@Component({
  selector: 'app-life-points',
  templateUrl: './life-points.component.html',
  styleUrls: ['./life-points.component.scss'],
  standalone: true,
})
export class LifePointsComponent {
  private readonly soundboardService = inject(SoundboardService);

  lifePoints = input<number>();
  compact = input(false);
  playerName = input<string>();
  displayValue = signal<number | undefined>(undefined);
  animating = signal(false);
  gaining = signal(false);

  private animFrom = 0;
  private animTarget = 0;
  private animStart = 0;
  private rafId = 0;
  private ready = false;

  constructor() {
    setTimeout(() => (this.ready = true), 250);

    effect(() => {
      const next = this.lifePoints();
      if (next === undefined || !this.ready) {
        untracked(() => this.displayValue.set(next));
        return;
      }

      const current = untracked(this.displayValue) ?? next;
      this.animFrom = current;
      this.animTarget = next;

      untracked(() => {
        this.gaining.set(next > current);
        if (!this.animating()) {
          this.soundboardService.lifePointsSound();
          this.animating.set(true);
        }
      });

      cancelAnimationFrame(this.rafId);
      this.animStart = performance.now();
      this.animate();
    });
  }

  private animate() {
    this.rafId = requestAnimationFrame((now) => {
      const t = Math.min((now - this.animStart) / ANIM_DURATION, 1);
      const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
      this.displayValue.set(Math.round(this.animFrom + (this.animTarget - this.animFrom) * eased));

      if (t < 1) {
        this.animate();
      } else {
        this.animating.set(false);
      }
    });
  }
}
