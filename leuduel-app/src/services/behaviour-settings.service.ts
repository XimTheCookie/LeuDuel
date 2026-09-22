import {
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { PersistanceService } from './persistance.service';

export const VALUE_LABELS = {
  counterReset: ['Never', 'Game', 'Match'],
  gameReset: ['Never', 'LP Zero (Suggest)', 'LP Zero (Auto)'],
};

const DEFAULT_VALUES: BehaviourSettingsSnapshot = {
  counterReset: 1,
  gameReset: 0,
};

const SETTINGS_KEY = 'behaviour-settings';

interface BehaviourSettingsSnapshot {
  counterReset: number;
  gameReset: number;
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

  constructor(private persistance: PersistanceService) {
    const injector = inject(EnvironmentInjector);
    this.restore().then(() => runInInjectionContext(injector, () => effect(() => this.persist())));
  }

  private async restore() {
    const saved = await this.persistance.load<BehaviourSettingsSnapshot>(SETTINGS_KEY);
    if (!saved) return;
    this.counterReset.set(saved.counterReset);
    this.gameReset.set(saved.gameReset);
  }

  private persist() {
    const snapshot: BehaviourSettingsSnapshot = {
      counterReset: this.counterReset(),
      gameReset: this.gameReset(),
    };
    this.persistance.save(SETTINGS_KEY, snapshot);
  }
}
