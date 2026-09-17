import { LifeChange } from './life-change.model';

export interface Player {
  name: string;
  lifePoints: number;
  lifeChanges: LifeChange[];
  wins: number;
}
