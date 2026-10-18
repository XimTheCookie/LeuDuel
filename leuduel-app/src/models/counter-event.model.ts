export interface CounterEvent {
  player: 1 | 2;
  type: 'mz' | 'stz' | 'emz' | 'fz';
  index: number;
  value?: number;
}
