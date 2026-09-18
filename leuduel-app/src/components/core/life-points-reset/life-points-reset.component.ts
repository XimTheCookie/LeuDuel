import { Component, computed, Inject, inject, signal } from '@angular/core';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { SettingsService } from '../../../services/settings.service';
import { MODAL_DATA } from '../../common/modal-generic/modal-generic.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { ModalConfig } from '../../../services/modal.service';
import { ButtonComponent } from '../../common/button/button.component';
import { Type } from '@angular/core';
import { TextButtonComponent } from '../../common/text-button/text-button.component';

@Component({
  selector: 'app-life-points-reset',
  templateUrl: './life-points-reset.component.html',
  styleUrls: ['./life-points-reset.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TextButtonComponent],
})
export class LifePointsResetComponent {
  private readonly settingsService = inject(SettingsService);
  readonly duelStore = inject(DuelStore);

  selectedPlayer = signal<'player1' | 'player2' | null>(null);

  isOngoing = computed(() => this.duelStore.isDuelStarted() && !this.duelStore.isDuelPaused());

  constructor(
    @Inject(MODAL_DATA)
    private readonly modalData: {
      component: Type<unknown>;
      config: ModalConfig;
      overlayRef: OverlayRef;
    },
  ) {}

  togglePlayer(player: 'player1' | 'player2' | null) {
    this.selectedPlayer.set(player);
  }

  closeModal(reset = false) {
    if (reset) {
      const selected = this.selectedPlayer();
      if (selected !== null) {
        this.duelStore.addVictory(selected);
      }
      this.duelStore.lifeAction('player1', {
        type: 'set',
        change: this.settingsService.getStartingLifePoints(),
        lifeReset: true,
      });
      this.duelStore.lifeAction('player2', {
        type: 'set',
        change: this.settingsService.getStartingLifePoints(),
        lifeReset: true,
      });
    }
    this.modalData.overlayRef.dispose();
  }
}
