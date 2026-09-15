import { Component, inject, input, signal } from '@angular/core';
import { LifeAction } from '../../../models/life-action.model';
import { DuelStore } from '../../../stores/duel-store/duel.store';

@Component({
  selector: 'app-damage-button',
  templateUrl: './damage-button.component.html',
  styleUrl: './damage-button.component.scss',
  standalone: true,
})
export class DamageButtonComponent {
  player = input.required<'player1' | 'player2'>();
  change = input.required<number>();
  type = input.required<LifeAction['type']>();

  private readonly duelStore = inject(DuelStore);
  private readonly coolingDown = signal(false);

  get typeLabel() {
    return this.type().charAt(0).toUpperCase() + this.type().slice(1);
  }

  get typeSymbol() {
    switch (this.type()) {
      case 'damage':
        return '-';
      case 'heal':
        return '+';
      case 'divide':
        return '/';
      case 'multiply':
        return 'x';
      case 'set':
        return '=';
    }
  }

  onClick() {
    if (this.coolingDown()) {
      return;
    }

    this.coolingDown.set(true);
    setTimeout(() => this.coolingDown.set(false), 50);
    this.duelStore.lifeAction(this.player(), {
      change: this.change(),
      type: this.type(),
    });
  }
}
