export interface AppliedCondition {
  description: string;
  positive: boolean;
}

export interface CardCondition {
  id: number;
  name: string;
  targets: 'player1' | 'player2' | 'both';
  cardName: string;
  conditions: AppliedCondition[];
}
