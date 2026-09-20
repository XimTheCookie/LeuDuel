import { Component, computed, inject, signal } from '@angular/core';
import { LifePointsComponent } from '../../components/core/life-points/life-points.component';
import { LandscapeActionsComponent } from '../../components/core/landscape-actions/landscape-actions.component';
import { DuelControllerComponent } from '../../components/core/duel-controller/duel-controller.component';
import { PlayerPanelComponent } from '../../components/core/player-panel/player-panel.component';
import { SettingsService } from '../../services/settings.service';
import { ModalService } from '../../services/modal.service';
import { DuelStore } from '../../stores/duel-store/duel.store';
import { LifePointsAdjustModalComponent } from '../../components/core/life-points-adjust-modal/life-points-adjust-modal.component';

@Component({
  selector: 'app-duel-page',
  templateUrl: './duel-page.component.html',
  styleUrl: './duel-page.component.scss',
  imports: [
    PlayerPanelComponent,
    DuelControllerComponent,
    LandscapeActionsComponent,
    LifePointsComponent,
  ],
  standalone: true,
})
export class DuelPageComponent {
  readonly settingsService = inject(SettingsService);
  private readonly modalService = inject(ModalService);
  private readonly duelStore = inject(DuelStore);

  lifePoints1 = this.duelStore.lifePoints1;
  lifePoints2 = this.duelStore.lifePoints2;
  playerName1 = computed(() => this.duelStore.player1().name);
  playerName2 = computed(() => this.duelStore.player2().name);
  selectedPlayer = signal<'player1' | 'player2'>('player1');

  onLpClick(player: 'player1' | 'player2') {
    if (this.selectedPlayer() !== player) {
      this.selectedPlayer.set(player);
    } else {
      this.modalService.open(
        LifePointsAdjustModalComponent,
        { opacity: this.settingsService.getModalOpacity(), size: 'sm' },
        { player },
      );
    }
  }
}
