import {
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { PersistanceService } from './persistance.service';

export const BEHAVIOURS_CONFIG = {
  counterReset: {
    labels: ['Never', 'Game', 'Match'],
    helper: `Defines when counters are reset.
<ul>
  <li><b>Never</b>: counters are never reset automatically.</li>
  <li><b>Game</b>: counters reset whenever LP are reset.</li>
  <li><b>Match</b>: counters reset at the start or end of a match.</li>
</ul>`,
  },
  gameReset: {
    labels: ['Manual', 'LP Zero', 'LP Zero (auto)'],
    helper: `Defines when the LP reset modal is displayed.
<ul>
  <li><b>Manual</b>: the modal only opens when triggered explicitly.</li>
  <li><b>LP Zero</b>: the modal opens automatically when any player's LP reaches zero.</li>
  <li><b>LP Zero (auto)</b>: same as above, but the modal is auto-confirmed without opening, resetting LP immediately.</li>
</ul>`,
  },
  winnerSelect: {
    labels: ['Manual', 'Auto'],
    helper: `Defines how the winner is assigned in the LP reset modal.
<ul>
  <li><b>Manual</b>: the winner is selected by the user.</li>
  <li><b>Auto</b>: the winner is suggested automatically. If <i>Game Reset</i> is also set to <i>LP Zero (auto)</i>, the winner is picked and confirmed without any interaction.</li>
</ul>`,
  },
};

const DEFAULT_VALUES: BehaviourSettingsSnapshot = {
  counterReset: 1,
  gameReset: 0,
  winnerSelect: 0,
};

const SETTINGS_KEY = 'behaviour-settings';

interface BehaviourSettingsSnapshot {
  counterReset: number;
  gameReset: number;
  winnerSelect: number;
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
  }

  private persist() {
    const snapshot: BehaviourSettingsSnapshot = {
      counterReset: this.counterReset(),
      gameReset: this.gameReset(),
      winnerSelect: this.winnerSelect(),
    };
    this.persistance.save(SETTINGS_KEY, snapshot);
  }
}
