import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CoinEvent } from '../../models/coin-event.model';
import { PlayerCounters } from '../../models/player-counters.model';
import { RollEvent } from '../../models/roll-event.model';
import { RandomService } from '../../services/random/random.service';
import { PersistanceService } from '../../services/settings/persistance.service';
import { CounterEvent } from '../../models/counter-event.model';

interface ToolsState {
  player1rolls: RollEvent[];
  player2rolls: RollEvent[];
  player1coins: CoinEvent[];
  player2coins: CoinEvent[];
  emz: number[];
  fz: number[];
  player1counters: PlayerCounters;
  player2counters: PlayerCounters;
}

const initialState: ToolsState = {
  player1rolls: [],
  player2rolls: [],
  player1coins: [],
  player2coins: [],
  emz: [0, 0],
  fz: [0, 0],
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
    getCounter(event: CounterEvent): number {
      const type = event.type;
      const player = event.player;
      const index = event.index;
      if (type === 'emz' || type === 'fz') {
        return store[type]()[index];
      }
      if (player === 1) {
        return store.player1counters()[type][index];
      }
      return store.player2counters()[type][index];
    },
    setCounter(event: CounterEvent): void {
      const type = event.type;
      const player = event.player;
      const index = event.index;
      const value = Math.abs(event.value ?? 0);
      if (type === 'emz' || type === 'fz') {
        patchState(store, {
          [type]: store[type]().map((v, i) => (i === index ? value : v)),
        });
        return;
      }
      if (player === 1) {
        patchState(store, {
          player1counters: {
            ...store.player1counters(),
            [type]: [...store.player1counters()[type].map((v, i) => (i === index ? value : v))],
          },
        });
      } else {
        patchState(store, {
          player2counters: {
            ...store.player2counters(),
            [type]: [...store.player2counters()[type].map((v, i) => (i === index ? value : v))],
          },
        });
      }
    },
    resetCounters() {
      patchState(store, {
        player1counters: { mz: [0, 0, 0, 0, 0], stz: [0, 0, 0, 0, 0] },
        player2counters: { mz: [0, 0, 0, 0, 0], stz: [0, 0, 0, 0, 0] },
        emz: [0, 0],
        fz: [0, 0],
      });
    },
  })),
  withHooks({
    onInit(store, persistance = inject(PersistanceService), injector = inject(Injector)) {
      persistance.load<ToolsState>(TOOLS_STORE_KEY).then((saved) => {
        if (saved) patchState(store, saved);
        runInInjectionContext(injector, () =>
          watchState(store, (state) => persistance.save(TOOLS_STORE_KEY, state)),
        );
      });
    },
  }),
);
