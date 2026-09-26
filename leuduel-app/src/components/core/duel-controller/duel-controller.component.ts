import { AfterViewInit, Component, effect, inject, signal, untracked } from '@angular/core';
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
import { CounterPageComponent } from '../../../pages/counter-page/counter-page.component';
import { BehaviourSettingsService } from '../../../services/behaviour-settings.service';
import { TimerService } from '../../../services/timer.service';
import { TimerComponent } from '../../common/timer/timer.component';
import { OpponentPickerModalComponent } from '../opponent-picker-modal/opponent-picker-modal.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-duel-controller',
  templateUrl: './duel-controller.component.html',
  styleUrl: './duel-controller.component.scss',
  standalone: true,
  imports: [ButtonComponent, TimerComponent],
})
export class DuelControllerComponent implements AfterViewInit {
  private readonly androidManagementService = inject(AndroidManagementService);
  readonly settingsService = inject(SettingsService);
  private readonly behaviourSettings = inject(BehaviourSettingsService);
  private readonly soundboardService = inject(SoundboardService);
  private readonly timerService = inject(TimerService);
  duelStore = inject(DuelStore);

  private readonly wasOvertime = signal<boolean>(false);
  private readonly modalService = inject(ModalService);

  startupStop = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.timerService.isRunning()) {
        this.androidManagementService.keepAwake(this.settingsService.getKeepAwake());
      } else {
        this.androidManagementService.allowSleep();
      }
    });

    effect(() => {
      const isOvertime = this.timerService.isOvertime();
      if (isOvertime && !this.wasOvertime()) {
        this.soundboardService.alarmSound();
        this.wasOvertime.set(true);
      } else if (!isOvertime) {
        this.wasOvertime.set(false);
      }
    });

    effect(() => {
      const bestOf = this.settingsService.getNumberOfGames();
      const winsPlayer1 = this.duelStore.wins1();
      const winsPlayer2 = this.duelStore.wins2();
      if (winsPlayer1 === 0 && winsPlayer2 === 0) return;
      if (winsPlayer1 >= bestOf / 2 || winsPlayer2 >= bestOf / 2) {
        if (
          this.behaviourSettings.matchStop() === 1 &&
          untracked(() => this.duelStore.isDuelStarted())
        ) {
          this.suggestMatchStop();
        }
      }
    });

    this.behaviourSettings.settingsInitialized.pipe(take(1)).subscribe(() => {
      if (this.behaviourSettings.onStartup() === 1) {
        this.startupStop.set(true);
      }
    });
  }

  private suggestMatchStop() {
    setTimeout(() => {
      const bestOf = this.settingsService.getNumberOfGames();
      const winsPlayer1 = this.duelStore.wins1();
      const winsPlayer2 = this.duelStore.wins2();
      if (winsPlayer1 === 0 && winsPlayer2 === 0) return;
      if (winsPlayer1 >= bestOf / 2 || winsPlayer2 >= bestOf / 2) {
        if (this.behaviourSettings.matchStop() === 1 && this.duelStore.isDuelStarted()) {
          this.stopMatch();
        }
      }
    }, 1000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.startupStop()) {
        this.handleStopMatch();
      } else {
        this.timerService.update();
      }
    }, 500);
  }

  pauseDuel() {
    this.duelStore.pauseDuel();
    this.soundboardService.clickSound();
    this.timerService.stop();
    this.timerService.update();
  }

  resumeDuel() {
    this.duelStore.resumeDuel();
    this.soundboardService.clickSound();
    this.timerService.update();
  }

  stopMatch() {
    this.modalService.open(
      StopMatchModalComponent,
      { size: 'sm', opacity: this.settingsService.getModalOpacity() },
      () => {
        this.handleStopMatch();
        this.soundboardService.confirmationSound();
      },
    );
  }

  private handleStopMatch() {
    this.duelStore.reset();
    this.timerService.reset();
  }

  startDuel() {
    if (this.settingsService.showCustomPlayers()) {
      this.modalService.open(
        OpponentPickerModalComponent,
        { size: 'sm', opacity: this.settingsService.getModalOpacity() },
        (opponentId?: number) => this.handleStart(opponentId),
      );
    } else {
      this.handleStart();
    }
  }

  handleStart(opponentId?: number) {
    this.soundboardService.confirmationSound();
    this.duelStore.startDuel(opponentId);
    this.timerService.update();
  }

  resetLifePoints() {
    this.modalService.open(LifePointsResetComponent, {
      size: 'sm',
      opacity: this.settingsService.getModalOpacity(),
    });
  }

  openSettings() {
    this.modalService.open(SettingsPageComponent, {
      size: 'full',
      closeEvent: () => this.handleStopMatch(),
      opacity: this.settingsService.getModalOpacity(),
    });
  }

  viewLog() {
    this.modalService.open(LogsPageComponent, {
      size: 'md',
      opacity: this.settingsService.getModalOpacity(),
    });
  }

  openToolsPage() {
    this.modalService.open(ToolsPageComponent, {
      size: 'full',
      opacity: this.settingsService.getModalOpacity(),
      hideClose: true,
    });
  }

  openCountersPage() {
    this.modalService.open(CounterPageComponent, {
      size: 'full',
      opacity: this.settingsService.getModalOpacity(),
      hideClose: true,
    });
  }

  openJudgePage() {
    this.modalService.open(JudgePageComponent, {
      size: 'full',
      opacity: this.settingsService.getModalOpacity(),
    });
  }

  toggleSounds() {
    this.settingsService.toggleSounds();
    this.soundboardService.clickSound();
  }
}
