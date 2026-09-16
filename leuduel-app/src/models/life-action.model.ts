export interface LifeAction {
  change: number;
  type: 'damage' | 'heal' | 'set' | 'multiply' | 'divide';
  lifeReset?: boolean;
}
