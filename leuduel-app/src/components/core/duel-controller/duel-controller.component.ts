import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { LogsPageComponent } from '../../../pages/logs-page/logs-page.component';
import { SettingsPageComponent } from '../../../pages/settings-page/settings-page.component';
import { ModalService } from '../../../services/modal.service';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { ButtonComponent } from '../../common/button/button.component';
import { LifePointsResetComponent } from '../life-points-reset/life-points-reset.component';
import { StopMatchModalComponent } from '../stop-match-modal/stop-match-modal.component';
import { ToolsPageComponent } from '../../../pages/tools-page/tools-page.component';
import { JudgePageComponent } from '../../../pages/judge-page/judge-page.component';
import { AndroidManagementService } from '../../../services/android-management.service';
import { SettingsService } from '../../../services/settings.service';
import { SoundboardService } from '../../../services/soundboard.service';

@Component({
  selector: 'app-duel-controller',
  templateUrl: './duel-controller.component.html',
  styleUrl: './duel-controller.component.scss',
  standalone: true,
  imports: [DatePipe, ButtonComponent],
})
export class DuelControllerComponent implements AfterViewInit {
  private readonly androidManagementService = inject(AndroidManagementService);
  readonly settingsService = inject(SettingsService);
  private readonly soundboardService = inject(SoundboardService);
  duelStore = inject(DuelStore);

  remainingTime = signal<number>(this.duelStore.timer().duration);
  remainingTimeTimeout = signal<number | null>(null);
  wasOvertime = signal<boolean>(false);
  isOvertime = computed(() => this.remainingTime() < 0);

  private readonly modalService = inject(ModalService);

  isDuelRunning = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isDuelRunning()) {
        this.androidManagementService.keepAwake();
      } else {
        this.androidManagementService.allowSleep();
      }
    });

    effect(() => {
      const isOvertime = this.isOvertime();
      if (isOvertime && !this.wasOvertime()) {
        this.soundboardService.alarmSound();
        this.wasOvertime.set(true);
      } else if (!isOvertime) {
        this.wasOvertime.set(false);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateRemainingTime(), 500);
  }

  private updateRemainingTime(): void {
    if (this.duelStore.isDuelStarted() === false) {
      this.stopRemainingTimeUpdate();
      return;
    }
    const timer = this.duelStore.timer();

    if (!timer) {
      this.isDuelRunning.set(false);
      return;
    }
    this.isDuelRunning.set(true);

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
    this.isDuelRunning.set(false);
  }

  pauseDuel() {
    this.duelStore.pauseDuel();
    this.soundboardService.clickSound();
    this.stopRemainingTimeUpdate();
    this.updateRemainingTime();
  }

  resumeDuel() {
    this.duelStore.resumeDuel();
    this.soundboardService.clickSound();
    this.updateRemainingTime();
  }

  stopMatch() {
    this.modalService.open(StopMatchModalComponent, { size: 'sm', opacity: 0.7 }, () => {
      this.handleStopMatch();
      this.soundboardService.confirmationSound();
    });
  }

  private handleStopMatch() {
    this.duelStore.reset();
    this.stopRemainingTimeUpdate();
    this.remainingTime.set(this.duelStore.timer().duration);
  }

  startDuel() {
    this.duelStore.startDuel('Player 1', 'Player 2');
    this.soundboardService.confirmationSound();
    this.updateRemainingTime();
  }

  resetLifePoints() {
    this.modalService.open(LifePointsResetComponent, { size: 'sm', opacity: 0.7 });
  }

  openSettings() {
    this.modalService.open(SettingsPageComponent, {
      size: 'full',
      closeEvent: () => this.handleStopMatch(),
    });
  }

  viewLog() {
    this.modalService.open(LogsPageComponent, {
      size: 'md',
      opacity: 0.7,
    });
  }

  openToolsPage() {
    this.modalService.open(ToolsPageComponent, {
      size: 'full',
      opacity: 0.7,
      hideClose: true,
    });
  }

  openJudgePage() {
    this.modalService.open(JudgePageComponent, {
      size: 'full',
      opacity: 0.7,
    });
  }

  toggleSounds() {
    this.settingsService.toggleSounds();
  }
}
