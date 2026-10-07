import {
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { PersistanceService } from './persistance.service';
import { Subject } from 'rxjs';

export const BEHAVIOURS_CONFIG = {
  counterReset: {
    labels: [
      'behaviour-settings.counter-reset.label.never',
      'behaviour-settings.counter-reset.label.game',
      'behaviour-settings.counter-reset.label.match',
    ],
    helper: 'behaviour-settings.counter-reset.info',
  },
  gameReset: {
    labels: [
      'behaviour-settings.game-reset.label.manual',
      'behaviour-settings.game-reset.label.lp-zero',
      'behaviour-settings.game-reset.label.lp-zero-auto',
    ],
    helper: 'behaviour-settings.game-reset.info',
  },
  winnerSelect: {
    labels: [
      'behaviour-settings.winner-selection.label.manual',
      'behaviour-settings.winner-selection.label.auto',
    ],
    helper: 'behaviour-settings.winner-selection.info',
  },
  matchStop: {
    labels: [
      'behaviour-settings.match-stop.label.manual',
      'behaviour-settings.match-stop.label.winner-found',
      'behaviour-settings.match-stop.label.timer-ends',
      'behaviour-settings.match-stop.label.both',
    ],
    helper: 'behaviour-settings.match-stop.info',
  },
  onStartup: {
    labels: [
      'behaviour-settings.on-startup.label.restore',
      'behaviour-settings.on-startup.label.reset',
    ],
    helper: 'behaviour-settings.on-startup.info',
  },
};

const DEFAULT_VALUES: BehaviourSettingsSnapshot = {
  counterReset: 1,
  gameReset: 0,
  winnerSelect: 0,
  matchStop: 0,
  onStartup: 0,
};

const SETTINGS_KEY = 'behaviour-settings';

interface BehaviourSettingsSnapshot {
  counterReset: number;
  gameReset: number;
  winnerSelect: number;
  matchStop: number;
  onStartup: number;
}

/**
 * Service for changing applications behaviours preferences
 * no graphic or preferences for UI or values
 * but things such as what resetting the match should reset or not
 * or resetting the game, etc, so minor customizations for the end user to customize
 * its whole app experience
 */
@Injectable({
  providedIn: 'root',
})
export class BehaviourSettingsService {
  counterReset = signal<number>(DEFAULT_VALUES.counterReset);
  gameReset = signal<number>(DEFAULT_VALUES.gameReset);
  winnerSelect = signal<number>(DEFAULT_VALUES.winnerSelect);
  matchStop = signal<number>(DEFAULT_VALUES.matchStop);
  onStartup = signal<number>(DEFAULT_VALUES.onStartup);

  settingsInitialized = new Subject<void>();

  constructor(private persistance: PersistanceService) {
    const injector = inject(EnvironmentInjector);
    this.restore().then(() => runInInjectionContext(injector, () => effect(() => this.persist())));
  }

  private async restore() {
    const saved = await this.persistance.load<BehaviourSettingsSnapshot>(SETTINGS_KEY);
    if (!saved) return;
    this.counterReset.set(saved.counterReset);
    this.gameReset.set(saved.gameReset);
    this.winnerSelect.set(saved.winnerSelect);
    this.matchStop.set(saved.matchStop);
    this.onStartup.set(saved.onStartup);

    this.settingsInitialized.next();
  }

  private persist() {
    const snapshot: BehaviourSettingsSnapshot = {
      counterReset: this.counterReset(),
      gameReset: this.gameReset(),
      winnerSelect: this.winnerSelect(),
      matchStop: this.matchStop(),
      onStartup: this.onStartup(),
    };
    this.persistance.save(SETTINGS_KEY, snapshot);
  }
}
