import { AfterViewInit, Component, computed, Inject, inject, signal } from '@angular/core';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { SettingsService } from '../../../services/settings.service';
import { MODAL_DATA } from '../../common/modal-generic/modal-generic.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { ModalConfig } from '../../../services/modal.service';
import { ButtonComponent } from '../../common/button/button.component';
import { Type } from '@angular/core';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { SoundboardService } from '../../../services/soundboard.service';
import { BehaviourSettingsService } from '../../../services/behaviour-settings.service';

@Component({
  selector: 'app-life-points-reset',
  templateUrl: './life-points-reset.component.html',
  styleUrls: ['./life-points-reset.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TextButtonComponent],
})
export class LifePointsResetComponent implements AfterViewInit {
  private readonly settingsService = inject(SettingsService);
  private readonly soundboardService = inject(SoundboardService);
  private readonly behaviourService = inject(BehaviourSettingsService);
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

  ngAfterViewInit(): void {
    if (this.behaviourService.winnerSelect() === 1) {
      const player1Lp = this.duelStore.lifePoints1();
      const player2Lp = this.duelStore.lifePoints2();
      if (player1Lp === player2Lp) this.togglePlayer(null);
      else if (player1Lp === 0) this.togglePlayer('player2');
      else if (player2Lp === 0) this.togglePlayer('player1');
    }
  }

  togglePlayer(player: 'player1' | 'player2' | null) {
    this.selectedPlayer.set(player);
    this.soundboardService.clickSound();
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
      this.soundboardService.confirmationSound();
    }
    this.modalData.overlayRef.dispose();
  }
}
