import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { SoundboardService } from '../../../services/soundboard.service';
import { SettingsService } from '../../../services/settings.service';

const ANIM_DURATION = 1500;

@Component({
  selector: 'app-life-points',
  templateUrl: './life-points.component.html',
  styleUrls: ['./life-points.component.scss'],
  standalone: true,
})
export class LifePointsComponent {
  private readonly settingsService = inject(SettingsService);
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
  private changeAudio: HTMLAudioElement | null = null;
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
          this.startSoundLoop();
          this.animating.set(true);
        }
      });

      cancelAnimationFrame(this.rafId);
      this.animStart = performance.now();
      const duration = Math.abs(next - current) < 100 ? 500 : ANIM_DURATION;
      this.animate(duration);
    });

    effect(() => {
      if (!this.settingsService.soundsOn() && this.changeAudio) {
        this.stopSoundLoop();
      }
    });
  }

  private startSoundLoop() {
    if (!this.settingsService.soundsOn()) return;
    this.changeAudio = new Audio('audio/lp_change.wav');
    this.changeAudio.play();
  }

  private stopSoundLoop() {
    this.changeAudio?.pause();
    this.changeAudio = null;
    if ((this.displayValue() ?? this.lifePoints()) === 0) this.soundboardService.lifePointsZero();
    else this.soundboardService.lifePointsSet();
  }

  private animate(duration: number) {
    this.rafId = requestAnimationFrame((now) => {
      const t = Math.min((now - this.animStart) / duration, 1);
      const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
      this.displayValue.set(Math.round(this.animFrom + (this.animTarget - this.animFrom) * eased));

      if (t < 1) {
        this.animate(duration);
      } else {
        this.stopSoundLoop();
        this.animating.set(false);
      }
    });
  }
}
