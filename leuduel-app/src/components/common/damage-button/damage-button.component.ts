import { Component, inject, input, output, signal } from '@angular/core';
import { LifeAction } from '../../../models/life-action.model';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { SoundboardService } from '../../../services/soundboard.service';

@Component({
  selector: 'app-damage-button',
  templateUrl: './damage-button.component.html',
  styleUrl: './damage-button.component.scss',
  standalone: true,
})
export class DamageButtonComponent {
  private readonly soundboardService = inject(SoundboardService);
  player = input.required<'player1' | 'player2'>();
  change = input.required<number>();
  type = input.required<LifeAction['type']>();
  fullHeight = input(false);

  private readonly duelStore = inject(DuelStore);
  private readonly coolingDown = signal(false);
  private holdTimer: ReturnType<typeof setTimeout> | null = null;

  doModify = output<void>();

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
    this.soundboardService.clickSound();

    this.coolingDown.set(true);
    setTimeout(() => this.coolingDown.set(false), 50);
    this.duelStore.lifeAction(this.player(), {
      change: this.change(),
      type: this.type(),
    });
  }

  onHold(event?: Event) {
    event?.preventDefault();
    if (this.coolingDown()) return;
    this.coolingDown.set(true);
    setTimeout(() => this.coolingDown.set(false), 50);
    this.doModify.emit();
  }

  onTouchStart(event: TouchEvent) {
    this.holdTimer = setTimeout(() => {
      event.preventDefault();
      this.onHold();
    }, 500);
  }

  onTouchEnd() {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
  }
}
