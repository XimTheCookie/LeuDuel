import { CardCondition } from './card-condition.model';
import { DuelStatus } from './duel-status.model';
import { Player } from './player.model';
import { TimerState } from './timer-state.model';

export interface DuelState {
  player1: Player;
  player2: Player;
  conditions: CardCondition[];
  status: DuelStatus;
  timer: TimerState;
  createdAt: number;
  updatedAt: number;
}
