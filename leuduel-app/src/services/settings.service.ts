import { Injectable, EnvironmentInjector, inject, signal, effect, runInInjectionContext } from '@angular/core';
import { LifeAction } from '../models/life-action.model';
import { PersistanceService } from './persistance.service';

const DEFAULT_VALUES = {
  startingLifePoints: 8000,
  duelDurationMs: 3000000,
  numberOfGames: 3,
  numberOfRapidButtons: 8,
  numberOfRapidButtonsColumns: 2,
  rapidButtons: [
    {
      change: 3000,
      type: 'damage',
    },
    {
      change: 2000,
      type: 'damage',
    },
    {
      change: 1000,
      type: 'damage',
    },
    {
      change: 500,
      type: 'damage',
    },
    {
      change: 250,
      type: 'damage',
    },
    {
      change: 100,
      type: 'damage',
    },
    {
      change: 1000,
      type: 'heal',
    },
    {
      change: 2,
      type: 'divide',
    },
  ] as LifeAction[],
  useKeepAwake: true,
};

const SETTINGS_KEY = 'settings';

interface SettingsSnapshot {
  startingLifePoints: number;
  numberOfGames: number;
  duelDurationMs: number;
  numberOfRapidButtons: number;
  rapidButtonsColumns: number;
  rapidButtonsConfig: LifeAction[];
  useKeepAwake: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private startingLifePoints = signal<number>(DEFAULT_VALUES.startingLifePoints);
  private numberOfGames = signal<number>(DEFAULT_VALUES.numberOfGames);
  private duelDurationMs = signal<number>(DEFAULT_VALUES.duelDurationMs);
  private numberOfRapidButtons = signal<number>(DEFAULT_VALUES.numberOfRapidButtons);
  rapidButtonsColumns = signal<number>(DEFAULT_VALUES.numberOfRapidButtonsColumns);
  rapidButtonsConfig = signal<LifeAction[]>(DEFAULT_VALUES.rapidButtons);
  private useKeepAwake = signal<boolean>(DEFAULT_VALUES.useKeepAwake);

  constructor(private persistance: PersistanceService) {
    const injector = inject(EnvironmentInjector);
    this.restore().then(() => runInInjectionContext(injector, () => effect(() => this.persist())));
  }

  private async restore() {
    const saved = await this.persistance.load<SettingsSnapshot>(SETTINGS_KEY);
    if (!saved) return;
    this.startingLifePoints.set(saved.startingLifePoints);
    this.numberOfGames.set(saved.numberOfGames);
    this.duelDurationMs.set(saved.duelDurationMs);
    this.numberOfRapidButtons.set(saved.numberOfRapidButtons);
    this.rapidButtonsColumns.set(saved.rapidButtonsColumns);
    this.rapidButtonsConfig.set(saved.rapidButtonsConfig);
    this.useKeepAwake.set(saved.useKeepAwake);
  }

  private persist() {
    const snapshot: SettingsSnapshot = {
      startingLifePoints: this.startingLifePoints(),
      numberOfGames: this.numberOfGames(),
      duelDurationMs: this.duelDurationMs(),
      numberOfRapidButtons: this.numberOfRapidButtons(),
      rapidButtonsColumns: this.rapidButtonsColumns(),
      rapidButtonsConfig: this.rapidButtonsConfig(),
      useKeepAwake: this.useKeepAwake(),
    };
    this.persistance.save(SETTINGS_KEY, snapshot);
  }

  getStartingLifePoints() {
    return this.startingLifePoints();
  }

  setStartingLifePoints(value: number) {
    this.startingLifePoints.set(value);
  }

  resetStartingLifePoints() {
    this.startingLifePoints.set(DEFAULT_VALUES.startingLifePoints);
  }

  getNumberOfGames() {
    return this.numberOfGames();
  }

  setNumberOfGames(value: number) {
    this.numberOfGames.set(value);
  }

  resetNumberOfGames() {
    this.numberOfGames.set(DEFAULT_VALUES.numberOfGames);
  }

  getDuelDuration() {
    return this.duelDurationMs();
  }

  setDuelDuration(value: number) {
    this.duelDurationMs.set(value);
  }

  resetDuelDuration() {
    this.duelDurationMs.set(DEFAULT_VALUES.duelDurationMs);
  }

  resetAllDuel() {
    this.resetStartingLifePoints();
    this.resetDuelDuration();
    this.resetNumberOfGames();
  }

  getNumberOfRapidButtons() {
    return this.numberOfRapidButtons();
  }

  setNumberOfRapidButtons(value: number) {
    this.numberOfRapidButtons.set(value);
    this.rapidButtonsConfig.update((config) => {
      if (value > config.length) {
        const diff = value - config.length;
        const newItems = Array.from(
          { length: diff },
          () =>
            ({
              change: 1000,
              type: 'damage',
            }) as LifeAction,
        );
        return [...config, ...newItems];
      } else if (value < config.length) {
        return config.slice(0, value);
      }
      return config;
    });
  }

  resetNumberOfRapidButtons() {
    this.numberOfRapidButtons.set(DEFAULT_VALUES.numberOfRapidButtons);
  }

  getRapidButtonsColumns() {
    return this.rapidButtonsColumns();
  }

  setRapidButtonsColumns(value: number) {
    this.rapidButtonsColumns.set(value);
  }

  resetRapidButtonsColumns() {
    this.rapidButtonsColumns.set(DEFAULT_VALUES.numberOfRapidButtonsColumns);
  }

  resetAllRapid() {
    this.resetNumberOfRapidButtons();
    this.resetRapidButtonsColumns();
  }

  getKeepAwake() {
    return this.useKeepAwake();
  }

  setKeepAwake(value: boolean) {
    this.useKeepAwake.set(value);
  }

  resetAll() {
    this.resetAllDuel();
    this.resetAllRapid();
    this.resetRapidButtonsConfig();
  }

  setRapidButtonsConfig(config: LifeAction[]) {
    this.rapidButtonsConfig.set(config);
  }

  updateRapidButton(index: number, newValues: LifeAction) {
    this.rapidButtonsConfig.update((config) => {
      const updated = [...config];
      updated[index] = newValues;
      return updated;
    });
  }

  resetRapidButtonsConfig() {
    this.rapidButtonsConfig.set(DEFAULT_VALUES.rapidButtons);
  }
}
