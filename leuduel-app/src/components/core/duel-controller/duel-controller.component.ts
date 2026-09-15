import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../common/button/button.component';

@Component({
  selector: 'app-duel-controller',
  templateUrl: './duel-controller.component.html',
  styleUrl: './duel-controller.component.scss',
  standalone: true,
  imports: [DatePipe, ButtonComponent],
})
export class DuelControllerComponent implements OnInit {
  duelStore = inject(DuelStore);

  remainingTime = signal<number>(this.duelStore.timer().duration);
  remainingTimeTimeout = signal<number | null>(null);
  isOvertime = computed(() => this.remainingTime() < 0);

  ngOnInit(): void {}

  private updateRemainingTime(): void {
    const timer = this.duelStore.timer();

    if (!timer) {
      return;
    }

    const elapsedTime = this.duelStore.isDuelPaused()
      ? timer.elapsedTime
      : timer.elapsedTime + Date.now() - timer.startTime;
    this.remainingTime.set(timer.duration - elapsedTime);

    if (this.duelStore.isDuelPaused()) {
      return;
    }

    const timeout = setTimeout(() => this.updateRemainingTime(), 250);

    this.remainingTimeTimeout.set(timeout);
  }

  stopRemainingTimeUpdate(): void {
    const remainingTimeTimeout = this.remainingTimeTimeout();
    if (remainingTimeTimeout !== null) {
      clearTimeout(remainingTimeTimeout);
      this.remainingTimeTimeout.set(null);
    }
  }

  pauseDuel = () => {
    this.duelStore.pauseDuel();
    this.stopRemainingTimeUpdate();
    this.updateRemainingTime();
  };

  resumeDuel = () => {
    this.duelStore.resumeDuel();
    this.updateRemainingTime();
  };

  resetDuel = () => {
    this.duelStore.reset();
    this.stopRemainingTimeUpdate();
    this.remainingTime.set(this.duelStore.timer().duration);
  };

  startDuel = () => {
    this.duelStore.startDuel('Player 1', 'Player 2');
    this.updateRemainingTime();
  };
}
