import { computed, inject, Injectable, signal } from '@angular/core';
import { DuelStore } from '../../stores/duel-store/duel.store';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private readonly duelStore = inject(DuelStore);

  remainingTime = signal<number>(this.duelStore.timer().duration);
  isOvertime = computed(() => this.remainingTime() < 0);

  private timeout = signal<number | null>(null);
  isRunning = signal<boolean>(false);

  update(): void {
    if (!this.duelStore.isDuelStarted()) {
      this.stop();
      return;
    }
    const timer = this.duelStore.timer();
    if (!timer) {
      this.isRunning.set(false);
      return;
    }
    this.isRunning.set(true);

    const elapsedTime = this.duelStore.isDuelPaused()
      ? timer.elapsedTime
      : timer.elapsedTime + Date.now() - timer.startTime;
    this.remainingTime.set(timer.duration - elapsedTime);

    if (this.duelStore.isDuelPaused()) return;

    this.timeout.set(setTimeout(() => this.update(), 250));
  }

  stop(): void {
    const t = this.timeout();
    if (t !== null) {
      clearTimeout(t);
      this.timeout.set(null);
    }
    this.isRunning.set(false);
  }

  reset(): void {
    this.stop();
    this.remainingTime.set(this.duelStore.timer().duration);
  }
}
