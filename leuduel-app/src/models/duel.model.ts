import { DuelStatus } from './duel-status.model';
import { Player } from './player.model';
import { TimerState } from './timer-state.model';

export interface DuelState {
  player1: Player;
  player2: Player;
  status: DuelStatus;
  timer: TimerState;
  createdAt: number;
  updatedAt: number;
}
