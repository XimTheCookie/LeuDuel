//*
// Rapresents change in life points of a player in a duel
// Used to log the history of life points changes in a duel
// And to be able to undo/redo life points changes
// Previous life points changes are stored in a stack, and can be undone/redone by popping/pushing the stack
// */
export interface LifeChange {
  timestamp: number;
  change: number;
  beforeChange: number;
  afterChange: number;
}
