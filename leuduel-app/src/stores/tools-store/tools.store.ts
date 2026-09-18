import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { RandomService } from '../../services/random.service';
import { RollEvent } from '../../models/roll-event.model';
import { CoinEvent } from '../../models/coin-event.model';

interface ToolsState {
  player1rolls: RollEvent[];
  player2rolls: RollEvent[];
  player1coins: CoinEvent[];
  player2coins: CoinEvent[];
}

const initialState: ToolsState = {
  player1rolls: [],
  player2rolls: [],
  player1coins: [],
  player2coins: [],
};

export const ToolsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, randomService = inject(RandomService)) => ({
    diceRoll(player: 1 | 2, min = 1, max = 6): void {
      const result = randomService.randomInt(min, max);
      const timestamp = Date.now();

      if (player === 1) {
        patchState(store, {
          player1rolls: [...store.player1rolls(), { min, max, result, timestamp }],
        });
      } else {
        patchState(store, {
          player2rolls: [...store.player2rolls(), { min, max, result, timestamp }],
        });
      }
    },
    coinFlip(player: 1 | 2): void {
      const result = randomService.coinFlip();
      const timestamp = Date.now();

      if (player === 1) {
        patchState(store, {
          player1coins: [...store.player1coins(), { result, timestamp }],
        });
      } else {
        patchState(store, {
          player2coins: [...store.player2coins(), { result, timestamp }],
        });
      }
    },
  })),
);
