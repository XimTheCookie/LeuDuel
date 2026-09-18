import { inject, Injector, runInInjectionContext } from '@angular/core';
import { patchState, signalStore, watchState, withHooks, withMethods, withState } from '@ngrx/signals';
import { RandomService } from '../../services/random.service';
import { RollEvent } from '../../models/roll-event.model';
import { CoinEvent } from '../../models/coin-event.model';
import { PlayerCounters } from '../../models/player-counters.model';
import { PersistanceService } from '../../services/persistance.service';

interface ToolsState {
  player1rolls: RollEvent[];
  player2rolls: RollEvent[];
  player1coins: CoinEvent[];
  player2coins: CoinEvent[];
  emz: number[];
  player1counters: PlayerCounters;
  player2counters: PlayerCounters;
}

const initialState: ToolsState = {
  player1rolls: [],
  player2rolls: [],
  player1coins: [],
  player2coins: [],
  emz: [0, 0],
  player1counters: { mz: [0, 0, 0, 0, 0], stz: [0, 0, 0, 0, 0] },
  player2counters: { mz: [0, 0, 0, 0, 0], stz: [0, 0, 0, 0, 0] },
};

const TOOLS_STORE_KEY = 'tools_store';

export const ToolsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, randomService = inject(RandomService)) => ({
    diceRoll(player: 1 | 2, min = 1, max = 6): void {
      const result = randomService.randomInt(min, max);
      const timestamp = Date.now();

      if (player === 1) {
        patchState(store, {
          player1rolls: [...store.player1rolls(), { min, max, result, timestamp }].slice(-10),
        });
      } else {
        patchState(store, {
          player2rolls: [...store.player2rolls(), { min, max, result, timestamp }].slice(-10),
        });
      }
    },
    coinFlip(player: 1 | 2): void {
      const result = randomService.coinFlip();
      const timestamp = Date.now();

      if (player === 1) {
        patchState(store, {
          player1coins: [...store.player1coins(), { result, timestamp }].slice(-10),
        });
      } else {
        patchState(store, {
          player2coins: [...store.player2coins(), { result, timestamp }].slice(-10),
        });
      }
    },
    addCounter(player: 1 | 2, type: 'mz' | 'stz', index: number): void {
      if (player === 1) {
        patchState(store, {
          player1counters: {
            ...store.player1counters(),
            [type]: [...store.player1counters()[type].map((v, i) => (i === index ? v + 1 : v))],
          },
        });
      } else {
        patchState(store, {
          player2counters: {
            ...store.player2counters(),
            [type]: [...store.player2counters()[type].map((v, i) => (i === index ? v + 1 : v))],
          },
        });
      }
    },
    removeCounter(player: 1 | 2, type: 'mz' | 'stz', index: number): void {
      if (player === 1) {
        patchState(store, {
          player1counters: {
            ...store.player1counters(),
            [type]: [
              ...store
                .player1counters()
                [type].map((v, i) => (i === index ? Math.max(v - 1, 0) : v)),
            ],
          },
        });
      } else {
        patchState(store, {
          player2counters: {
            ...store.player2counters(),
            [type]: [
              ...store
                .player2counters()
                [type].map((v, i) => (i === index ? Math.max(v - 1, 0) : v)),
            ],
          },
        });
      }
    },
    addEmz(zone: 0 | 1) {
      patchState(store, {
        emz: store.emz().map((v, i) => (i === zone ? v + 1 : v)),
      });
    },
    removeEmz(zone: 0 | 1) {
      patchState(store, {
        emz: store.emz().map((v, i) => (i === zone ? Math.max(v - 1, 0) : v)),
      });
    },
    resetCounters() {
      patchState(store, {
        player1counters: { mz: [0, 0, 0, 0, 0], stz: [0, 0, 0, 0, 0] },
        player2counters: { mz: [0, 0, 0, 0, 0], stz: [0, 0, 0, 0, 0] },
        emz: [0, 0],
      });
    },
  })),
  withHooks({
    onInit(store, persistance = inject(PersistanceService), injector = inject(Injector)) {
      persistance.load<ToolsState>(TOOLS_STORE_KEY).then((saved) => {
        if (saved) patchState(store, saved);
        runInInjectionContext(injector, () => watchState(store, (state) => persistance.save(TOOLS_STORE_KEY, state)));
      });
    },
  }),
);
