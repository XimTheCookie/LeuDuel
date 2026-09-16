import { Injectable, signal } from '@angular/core';

const DEFAULT_VALUES = {
  startingLifePoints: 8000,
  duelDurationMs: 3000000,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private startingLifePoints = signal<number>(DEFAULT_VALUES.startingLifePoints);

  private duelDurationMs = signal<number>(DEFAULT_VALUES.duelDurationMs);

  getStartingLifePoints() {
    return this.startingLifePoints();
  }

  setStartingLifePoints(value: number) {
    this.startingLifePoints.set(value);
  }

  resetStartingLifePoints() {
    this.startingLifePoints.set(DEFAULT_VALUES.startingLifePoints);
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

  resetAll() {
    this.resetStartingLifePoints();
    this.resetDuelDuration();
  }
}
