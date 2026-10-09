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
import { BehaviourOption } from '../../models/behavior-option.model';

export const BEHAVIOURS_CONFIG: Record<string, BehaviourOption> = {
  counterReset: {
    helper: 'behaviour-settings.counter-reset.info',
    label: 'behaviour-settings.counter-reset.title',
    values: [
      { label: 'behaviour-settings.counter-reset.label.never', value: 0 },
      { label: 'behaviour-settings.counter-reset.label.game', value: 1 },
      { label: 'behaviour-settings.counter-reset.label.match', value: 2 },
    ],
  },
  gameReset: {
    helper: 'behaviour-settings.game-reset.info',
    label: 'behaviour-settings.game-reset.title',
    values: [
      { label: 'behaviour-settings.game-reset.label.manual', value: 0 },
      { label: 'behaviour-settings.game-reset.label.lp-zero', value: 1 },
      { label: 'behaviour-settings.game-reset.label.lp-zero-auto', value: 2 },
    ],
  },
  winnerSelect: {
    helper: 'behaviour-settings.winner-selection.info',
    label: 'behaviour-settings.winner-selection.title',
    values: [
      { label: 'behaviour-settings.winner-selection.label.manual', value: 0 },
      { label: 'behaviour-settings.winner-selection.label.auto', value: 1 },
    ],
  },
  matchStop: {
    helper: 'behaviour-settings.match-stop.info',
    label: 'behaviour-settings.match-stop.title',
    values: [
      { label: 'behaviour-settings.match-stop.label.manual', value: 0 },
      { label: 'behaviour-settings.match-stop.label.winner-found', value: 1 },
      { label: 'behaviour-settings.match-stop.label.timer-ends', value: 2 },
      { label: 'behaviour-settings.match-stop.label.both', value: 3 },
    ],
  },
  onStartup: {
    helper: 'behaviour-settings.on-startup.info',
    label: 'behaviour-settings.on-startup.title',
    values: [
      { label: 'behaviour-settings.on-startup.label.restore', value: 0 },
      { label: 'behaviour-settings.on-startup.label.reset', value: 1 },
    ],
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
