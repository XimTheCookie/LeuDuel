import { LifeChange } from './life-change.model';
import { PlayerProfile } from './player-profile.modal';

export interface Player {
  name: string;
  lifePoints: number;
  lifeChanges: LifeChange[];
  wins: number;
  profile?: PlayerProfile;
}
