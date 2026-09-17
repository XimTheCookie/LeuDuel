import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { LogsPageComponent } from '../../../pages/logs-page/logs-page.component';
import { SettingsPageComponent } from '../../../pages/settings-page/settings-page.component';
import { ModalService } from '../../../services/modal.service';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { ButtonComponent } from '../../common/button/button.component';
import { LifePointsResetComponent } from '../life-points-reset/life-points-reset.component';

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

  private readonly modalService = inject(ModalService);

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

  pauseDuel() {
    this.duelStore.pauseDuel();
    this.stopRemainingTimeUpdate();
    this.updateRemainingTime();
  }

  resumeDuel() {
    this.duelStore.resumeDuel();
    this.updateRemainingTime();
  }

  resetDuel() {
    this.duelStore.reset();
    this.stopRemainingTimeUpdate();
    this.remainingTime.set(this.duelStore.timer().duration);
  }

  startDuel() {
    this.duelStore.startDuel('Player 1', 'Player 2');
    this.updateRemainingTime();
  }

  resetLifePoints() {
    this.modalService.open(LifePointsResetComponent, { size: 'sm', opacity: 0.7 });
  }

  openSettings() {
    this.modalService.open(SettingsPageComponent, {
      size: 'full',
      closeEvent: () => this.resetDuel(),
    });
  }

  viewLog() {
    this.modalService.open(LogsPageComponent, {
      size: 'md',
      opacity: 0.7,
    });
  }
}
