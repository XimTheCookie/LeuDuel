import { Component, inject, input } from '@angular/core';
import { LifeAction } from '../../../models/life-action.model';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { DamageButtonComponent } from '../../common/damage-button/damage-button.component';

@Component({
  selector: 'app-player-panel',
  templateUrl: './player-panel.component.html',
  styleUrl: './player-panel.component.scss',
  standalone: true,
  imports: [DamageButtonComponent],
})
export class PlayerPanelComponent {
  player = input.required<'player1' | 'player2'>();
  defaultDamageTypes: LifeAction[] = [
    {
      change: 1000,
      type: 'damage',
    },
    {
      change: 500,
      type: 'damage',
    },
    {
      change: 100,
      type: 'damage',
    },
    {
      change: 50,
      type: 'damage',
    },
    {
      change: 1000,
      type: 'heal',
    },
    {
      change: 500,
      type: 'heal',
    },
    {
      change: 100,
      type: 'heal',
    },
    {
      change: 2,
      type: 'divide',
    },
  ];

  duelStore = inject(DuelStore);

  get lifePoints() {
    return this.player() === 'player1'
      ? this.duelStore.lifePoints1()
      : this.duelStore.lifePoints2();
  }
}
