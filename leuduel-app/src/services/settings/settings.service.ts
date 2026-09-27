import {
  Injectable,
  EnvironmentInjector,
  inject,
  signal,
  effect,
  runInInjectionContext,
} from '@angular/core';
import { LifeAction } from '../../models/life-action.model';
import { PersistanceService } from './persistance.service';
import { Subject } from 'rxjs';
import { AndroidManagementService } from '../android/android-management.service';

const DEFAULT_VALUES: SettingsSnapshot = {
  startingLifePoints: 8000,
  duelDurationMs: 3000000,
  numberOfGames: 3,
  numberOfRapidButtons: 8,
  rapidButtonsColumns: 2,
  rapidButtonsConfig: [
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
  ],
  useKeepAwake: true,
  soundsOn: true,
  modalOpacity: 7,
  firstVisit: true,
  landscapeMode: false,
  swapPlayers: false,
  showCustomPlayers: false,
  theme: 'dark',
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
  soundsOn: boolean;
  landscapeMode: boolean;
  swapPlayers: boolean;
  modalOpacity: number;
  firstVisit: boolean;
  showCustomPlayers: boolean;
  theme: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly androidManagementService = inject(AndroidManagementService);

  private startingLifePoints = signal<number>(DEFAULT_VALUES.startingLifePoints);
  private numberOfGames = signal<number>(DEFAULT_VALUES.numberOfGames);
  private duelDurationMs = signal<number>(DEFAULT_VALUES.duelDurationMs);
  private numberOfRapidButtons = signal<number>(DEFAULT_VALUES.numberOfRapidButtons);
  rapidButtonsColumns = signal<number>(DEFAULT_VALUES.rapidButtonsColumns);
  rapidButtonsConfig = signal<LifeAction[]>(DEFAULT_VALUES.rapidButtonsConfig);
  private useKeepAwake = signal<boolean>(DEFAULT_VALUES.useKeepAwake);
  soundsOn = signal<boolean>(DEFAULT_VALUES.soundsOn);
  landscapeMode = signal<boolean>(false);
  swapPlayers = signal<boolean>(DEFAULT_VALUES.swapPlayers);
  modalOpacity = signal<number>(DEFAULT_VALUES.modalOpacity);
  firstVisit = signal<boolean>(DEFAULT_VALUES.firstVisit);
  showCustomPlayers = signal<boolean>(DEFAULT_VALUES.showCustomPlayers);
  theme = signal<string>(DEFAULT_VALUES.theme);

  settingsInitialized = new Subject<void>();

  constructor(private persistance: PersistanceService) {
    const injector = inject(EnvironmentInjector);
    this.restore().then(() => runInInjectionContext(injector, () => effect(() => this.persist())));
  }

  private async restore() {
    const saved = await this.persistance.load<SettingsSnapshot>(SETTINGS_KEY);
    if (!saved) {
      this.settingsInitialized.next();
      return;
    }
    this.startingLifePoints.set(saved.startingLifePoints);
    this.numberOfGames.set(saved.numberOfGames);
    this.duelDurationMs.set(saved.duelDurationMs);
    this.numberOfRapidButtons.set(saved.numberOfRapidButtons);
    this.rapidButtonsColumns.set(saved.rapidButtonsColumns);
    this.rapidButtonsConfig.set(saved.rapidButtonsConfig);
    this.useKeepAwake.set(saved.useKeepAwake);
    this.soundsOn.set(saved.soundsOn);
    this.landscapeMode.set(saved.landscapeMode ?? false);
    this.swapPlayers.set(saved.swapPlayers ?? false);
    this.modalOpacity.set(saved.modalOpacity ?? 7);
    this.firstVisit.set(saved.firstVisit == null ? true : saved.firstVisit);
    this.showCustomPlayers.set(saved.showCustomPlayers ?? false);
    this.theme.set(saved.theme ?? 'dark');
    this.applyMode();
    this.settingsInitialized.next();
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
      soundsOn: this.soundsOn(),
      landscapeMode: this.landscapeMode(),
      swapPlayers: this.swapPlayers(),
      modalOpacity: this.modalOpacity(),
      firstVisit: this.firstVisit(),
      showCustomPlayers: this.showCustomPlayers(),
      theme: this.theme(),
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
        const possibleValues = [2500, 2000, 1500, 1000, 500];
        const possibleTypes = ['damage', 'heal'];
        const newItems = Array.from(
          { length: diff },
          () =>
            ({
              change: possibleValues[Math.floor(Math.random() * possibleValues.length)],
              type: possibleTypes[Math.floor(Math.random() * possibleTypes.length)],
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
    this.rapidButtonsColumns.set(DEFAULT_VALUES.rapidButtonsColumns);
  }

  resetAllRapid() {
    this.resetNumberOfRapidButtons();
    this.resetRapidButtonsColumns();
  }

  setSwapPlayers(value: boolean) {
    this.swapPlayers.set(value);
  }

  resetSwapPlayers() {
    this.swapPlayers.set(DEFAULT_VALUES.swapPlayers);
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

  toggleSounds() {
    this.soundsOn.set(!this.soundsOn());
  }

  updateRapidButton(index: number, newValues: LifeAction) {
    this.rapidButtonsConfig.update((config) => {
      const updated = [...config];
      updated[index] = newValues;
      return updated;
    });
  }

  setModalOpacity(value: number) {
    this.modalOpacity.set(value);
  }

  getModalOpacity() {
    return (this.modalOpacity() ?? 7) / 10;
  }

  resetRapidButtonsConfig() {
    this.rapidButtonsConfig.set(DEFAULT_VALUES.rapidButtonsConfig);
  }

  setLandscapeMode(value: boolean) {
    this.landscapeMode.set(value);
  }

  setFirstVisitDone() {
    this.firstVisit.set(false);
  }

  setCustomPlayers(value: boolean) {
    this.showCustomPlayers.set(value);
  }

  resetCustomPlayers() {
    this.showCustomPlayers.set(DEFAULT_VALUES.showCustomPlayers);
  }

  setTheme(value: string) {
    this.theme.set(value);
    this.applyMode();
  }

  resetTheme() {
    this.theme.set(DEFAULT_VALUES.theme);
    this.applyMode();
  }

  private applyMode() {
    const t = this.theme();
    document.body.classList.remove('light', 'high-contrast');
    if (t === 'light') document.body.classList.add('light');
    else if (t === 'high-contrast') document.body.classList.add('high-contrast');
    if (t === 'light') {
      this.androidManagementService.setStatusBarLight();
    } else {
      this.androidManagementService.setStatusBarDark();
    }
  }
}
