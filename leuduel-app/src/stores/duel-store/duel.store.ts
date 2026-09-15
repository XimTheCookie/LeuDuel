import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';
import { DuelState } from '../../models/duel.model';
import { DuelStatus } from '../../models/duel-status.model';
import { LifeAction } from '../../models/life-action.model';
import { LifeChange } from '../../models/life-change.model';

const initialState: DuelState = {
  player1: { name: 'P1', lifePoints: 8000, lifeChanges: [] },
  player2: { name: 'P2', lifePoints: 8000, lifeChanges: [] },
  status: DuelStatus.FINISHED,
  timer: { startTime: 0, elapsedTime: 0, duration: 10000 },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const DuelStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isDuelStarted: computed(() => store.status() !== DuelStatus.FINISHED),
    isDuelPaused: computed(() => store.status() === DuelStatus.PAUSED),
    lifePoints1: computed(() => store.player1().lifePoints),
    lifePoints2: computed(() => store.player2().lifePoints),
  })),
  withMethods((store) => ({
    reset(): void {
      patchState(store, initialState);
    },
    startDuel(player1: string, player2: string): void {
      patchState(store, {
        player1: { name: player1, lifePoints: 8000, lifeChanges: [] },
        player2: { name: player2, lifePoints: 8000, lifeChanges: [] },
        status: DuelStatus.ONGOING,
        timer: { startTime: Date.now(), elapsedTime: 0, duration: 10000 },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    },
    pauseDuel(): void {
      console.log('pause');
      const timer = store.timer();
      const elapsedSinceStart = Date.now() - timer.startTime;

      patchState(store, {
        status: DuelStatus.PAUSED,
        timer: {
          startTime: timer.startTime,
          elapsedTime: timer.elapsedTime + elapsedSinceStart,
          duration: timer.duration,
        },
      });
    },
    resumeDuel(): void {
      patchState(store, {
        status: DuelStatus.ONGOING,
        timer: {
          startTime: Date.now(),
          elapsedTime: store.timer().elapsedTime,
          duration: store.timer().duration,
        },
      });
    },
    lifeAction(player: 'player1' | 'player2', LifeAction: LifeAction): void {
      const playerState = store[player]();
      console.log('playerState', playerState);
      const currentLifePoints = playerState.lifePoints;
      console.log('currentLifePoints', currentLifePoints);
      let newLifePoints = currentLifePoints;
      console.log('newLifePoints', newLifePoints);

      switch (LifeAction.type) {
        case 'damage':
          newLifePoints -= LifeAction.change;
          break;
        case 'heal':
          newLifePoints += LifeAction.change;
          break;
        case 'set':
          newLifePoints = LifeAction.change;
          break;
        case 'multiply':
          newLifePoints *= LifeAction.change;
          break;
        case 'divide':
          // rounted up the result of the division to avoid losing life points due to decimal values
          newLifePoints = Math.round(newLifePoints / LifeAction.change);
          break;
      }
      console.log('newLifePoints', newLifePoints);
      const effectiveChange = newLifePoints - currentLifePoints;
      console.log('effectiveChange', effectiveChange);
      newLifePoints = Math.max(0, newLifePoints);
      const change: LifeChange = {
        change: effectiveChange,
        timestamp: Date.now(),
        beforeChange: currentLifePoints,
        afterChange: newLifePoints,
      };
      const currentLifeChanges = playerState.lifeChanges ?? [];
      patchState(store, {
        [player]: {
          ...playerState,
          lifePoints: newLifePoints,
          lifeChanges: [...currentLifeChanges, change],
        },
      });
    },
  })),
);
