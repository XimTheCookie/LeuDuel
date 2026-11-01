import { Component, computed, inject, input, output, signal } from '@angular/core';
import { PlayerStore } from '../../../stores/player-store/player.store';

@Component({
  selector: 'app-button-profile',
  templateUrl: './button-profile.component.html',
  styleUrls: ['./button-profile.component.scss'],
  imports: [],
  standalone: true,
})
export class ButtonProfileComponent {
  private store = inject(PlayerStore);

  playerId = input.required<number>();
  size = input<'2xs' | 'xs' | 'sm' | 'md' | 'xl'>('md');
  isDisabled = input<boolean>(false);
  clicked = output<void>();

  coolingDown = signal(false);

  profile = computed(() => {
    const id = this.playerId();
    if (id === this.store.main()?.id) return this.store.main();
    return this.store.getOpponentById(id) ?? null;
  });

  clickHandler() {
    if (this.coolingDown() || this.isDisabled()) return;
    this.coolingDown.set(true);
    setTimeout(() => this.coolingDown.set(false), 100);
    this.clicked.emit();
  }
}
