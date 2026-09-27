import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { PlayerProfile } from '../../models/player-profile.modal';
import { PersistanceService } from '../../services/settings/persistance.service';
import { RandomService } from '../../services/random/random.service';

interface PlayerState {
  main: PlayerProfile | null;
  opponents: PlayerProfile[];
}

const initialState: PlayerState = {
  main: {
    displayName: 'Player 1',
    card: null,
    id: 0,
  },
  opponents: [
    {
      displayName: 'Player 2',
      card: null,
      id: 1,
    },
  ],
};

const PLAYER_STORE_KEY = 'player_store';

export const PlayerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, randomService = inject(RandomService)) => ({
    setProfile(displayName: string, cardUrl?: string) {
      patchState(store, {
        main: {
          displayName: displayName,
          card: cardUrl ?? null,
          id: 0,
        },
      });
    },
    addOpponent(displayName: string, cardUrl?: string) {
      const newOpponent: PlayerProfile = {
        displayName: displayName,
        card: cardUrl ?? null,
        id: parseFloat(`${Date.now()}${Math.random() * 1000}`),
      };
      patchState(store, (state) => ({
        opponents: [...state.opponents, newOpponent],
      }));
    },
    getOpponentById(id: number): PlayerProfile | undefined {
      return store.opponents().find((o) => o.id === id);
    },
    updateOpponent(id: number, displayName: string, cardUrl?: string) {
      patchState(store, (state) => ({
        opponents: [
          ...state.opponents.map((opponent) =>
            opponent.id === id
              ? {
                  ...opponent,
                  displayName: displayName,
                  card: cardUrl ?? null,
                }
              : opponent,
          ),
        ],
      }));
    },
    removeOpponent(id: number) {
      patchState(store, (state) => ({
        opponents: [...state.opponents.filter((o) => o.id !== id)],
      }));
    },
    resetStore() {
      patchState(store, initialState);
    },
  })),
  withHooks({
    onInit(store, persistance = inject(PersistanceService), injector = inject(Injector)) {
      persistance.load<PlayerState>(PLAYER_STORE_KEY).then((saved) => {
        if (saved) patchState(store, saved);
        runInInjectionContext(injector, () =>
          watchState(store, (state) => persistance.save(PLAYER_STORE_KEY, state)),
        );
      });
    },
  }),
);
