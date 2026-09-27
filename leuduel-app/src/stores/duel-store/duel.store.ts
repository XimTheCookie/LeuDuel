import { computed, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DuelStatus } from '../../models/duel-status.model';
import { DuelState } from '../../models/duel.model';
import { LifeAction } from '../../models/life-action.model';
import { LifeChange } from '../../models/life-change.model';
import { BehaviourSettingsService } from '../../services/settings/behaviour-settings.service';
import { PersistanceService } from '../../services/settings/persistance.service';
import { SettingsService } from '../../services/settings/settings.service';
import { ToolsStore } from '../tools-store/tools.store';
import { PlayerStore } from '../player-store/player.store';
import { PlayerProfile } from '../../models/player-profile.modal';

const initialState: DuelState = {
  player1: { name: 'Player 1', lifePoints: 8000, lifeChanges: [], wins: 0 },
  player2: { name: 'Player 2', lifePoints: 8000, lifeChanges: [], wins: 0 },
  status: DuelStatus.FINISHED,
  timer: { startTime: 0, elapsedTime: 0, duration: 3000000 },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const DUEL_STORE_KEY = 'duel_store';

export const DuelStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isDuelStarted: computed(() => store.status() !== DuelStatus.FINISHED),
    isDuelPaused: computed(() => store.status() === DuelStatus.PAUSED),
    isDuelFinished: computed(() => store.status() === DuelStatus.FINISHED),
    lifePoints1: computed(() => Math.min(store.player1().lifePoints, 99999999)),
    lifePoints2: computed(() => Math.min(store.player2().lifePoints, 99999999)),
    wins1: computed(() => store.player1().wins),
    wins2: computed(() => store.player2().wins),
  })),
  withMethods(
    (
      store,
      settingsService = inject(SettingsService),
      behaviourService = inject(BehaviourSettingsService),
      toolsStore = inject(ToolsStore),
      playerStore = inject(PlayerStore),
    ) => {
      const getRemainingTime = () => {
        const timer = store.timer();
        const elapsed = store.isDuelPaused()
          ? timer.elapsedTime
          : timer.elapsedTime + Date.now() - timer.startTime;
        return timer.duration - elapsed;
      };

      return {
        reset(): void {
          patchState(store, {
            player1: {
              name: 'Player 1',
              lifePoints: settingsService.getStartingLifePoints(),
              lifeChanges: [],
              wins: 0,
            },
            player2: {
              name: 'Player 2',
              lifePoints: settingsService.getStartingLifePoints(),
              lifeChanges: [],
              wins: 0,
            },
            status: DuelStatus.FINISHED,
            timer: {
              startTime: Date.now(),
              elapsedTime: 0,
              duration: settingsService.getDuelDuration(),
            },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          if (behaviourService.counterReset() > 0) toolsStore.resetCounters();
        },
        startDuel(opponentId?: number): void {
          let player1: PlayerProfile | undefined;
          let player2: PlayerProfile | undefined;
          if (settingsService.showCustomPlayers()) {
            player1 = playerStore.main() ?? undefined;
            if (opponentId !== undefined) {
              player2 = playerStore.getOpponentById(opponentId) ?? undefined;
            }
            if (!player2 && playerStore.opponents().length > 0) {
              player2 = playerStore.opponents()[0];
            }
          }

          patchState(store, {
            player1: {
              name: 'Player 1',
              lifePoints: settingsService.getStartingLifePoints(),
              lifeChanges: [],
              wins: 0,
              profile: player1,
            },
            player2: {
              name: 'Player 2',
              lifePoints: settingsService.getStartingLifePoints(),
              lifeChanges: [],
              wins: 0,
              profile: player2,
            },
            status: DuelStatus.ONGOING,
            timer: {
              startTime: Date.now(),
              elapsedTime: 0,
              duration: settingsService.getDuelDuration(),
            },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          if (behaviourService.counterReset() > 0) toolsStore.resetCounters();
        },
        pauseDuel(): void {
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
        addVictory(player: 'player1' | 'player2'): void {
          const playerState = store[player]();
          patchState(store, {
            [player]: { ...playerState, wins: playerState.wins + 1 },
          });
        },
        undoLifeChange(player: 'player1' | 'player2', timestamp: number): void {
          const playerState = store[player]();
          const changes = playerState.lifeChanges;
          const idx = changes.findIndex((c) => c.timestamp === timestamp);
          if (idx === -1) return;

          let lp = changes[idx].beforeChange;

          const before = changes.slice(0, idx);
          const after = changes.slice(idx + 1).map((c) => {
            const next = Math.max(0, lp + (c.afterChange - c.beforeChange));
            const recalc = { ...c, beforeChange: lp, afterChange: next };
            lp = next;
            return recalc;
          });

          patchState(store, {
            [player]: { ...playerState, lifePoints: lp, lifeChanges: [...before, ...after] },
          });
        },
        lifeAction(player: 'player1' | 'player2', lifeAction: LifeAction): void {
          const playerState = store[player]();
          const currentLifePoints = playerState.lifePoints;
          let newLifePoints = currentLifePoints;

          switch (lifeAction.type) {
            case 'damage':
              newLifePoints -= lifeAction.change;
              break;
            case 'heal':
              newLifePoints += lifeAction.change;
              break;
            case 'set':
              newLifePoints = lifeAction.change;
              break;
            case 'multiply':
              newLifePoints *= lifeAction.change;
              break;
            case 'divide':
              newLifePoints = Math.round(newLifePoints / lifeAction.change);
              break;
          }
          const effectiveChange = newLifePoints - currentLifePoints;
          newLifePoints = Math.max(0, newLifePoints);
          newLifePoints = Math.min(newLifePoints, 99999999);
          if (lifeAction.lifeReset) {
            if (behaviourService.counterReset() === 1) {
              toolsStore.resetCounters();
            }
          }
          const change: LifeChange = {
            player: playerState.name,
            change: effectiveChange,
            timestamp: Date.now(),
            timerSnapshot: getRemainingTime(),
            beforeChange: currentLifePoints,
            afterChange: newLifePoints,
            isReset: lifeAction.lifeReset ?? false,
          };
          const currentLifeChanges = playerState.lifeChanges ?? [];
          patchState(store, {
            [player]: {
              ...playerState,
              lifePoints: newLifePoints,
              lifeChanges:
                store.status() === DuelStatus.FINISHED ? [] : [...currentLifeChanges, change],
            },
          });
        },
      };
    },
  ),
  withHooks({
    onInit(store, persistance = inject(PersistanceService), injector = inject(Injector)) {
      persistance.load<DuelState>(DUEL_STORE_KEY).then((saved) => {
        if (saved) patchState(store, saved);
        runInInjectionContext(injector, () =>
          watchState(store, (state) => persistance.save(DUEL_STORE_KEY, state)),
        );
      });
    },
  }),
);
