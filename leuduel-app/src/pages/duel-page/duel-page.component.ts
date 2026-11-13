import { Component, computed, inject, signal } from '@angular/core';
import { WinsBarComponent } from '../../components/common/wins-bar/wins-bar.component';
import { DuelControllerComponent } from '../../components/core/duel-controller/duel-controller.component';
import { LandscapeActionsComponent } from '../../components/core/landscape-actions/landscape-actions.component';
import { LifePointsAdjustModalComponent } from '../../components/core/life-points-adjust-modal/life-points-adjust-modal.component';
import { LifePointsCalculatorComponent } from '../../components/core/life-points-calculator/life-points-calculator.component';
import { LifePointsComponent } from '../../components/core/life-points/life-points.component';
import { LpPanelComponent } from '../../components/core/lp-panel/lp-panel.component';
import { PlayerPanelComponent } from '../../components/core/player-panel/player-panel.component';
import { ModalService } from '../../services/modal/modal.service';
import { SettingsService } from '../../services/settings/settings.service';
import { DuelStore } from '../../stores/duel-store/duel.store';

@Component({
  selector: 'app-duel-page',
  templateUrl: './duel-page.component.html',
  styleUrl: './duel-page.component.scss',
  imports: [
    PlayerPanelComponent,
    DuelControllerComponent,
    LandscapeActionsComponent,
    LifePointsComponent,
    WinsBarComponent,
    LifePointsCalculatorComponent,
    LpPanelComponent,
  ],
  standalone: true,
})
export class DuelPageComponent {
  readonly settingsService = inject(SettingsService);
  private readonly modalService = inject(ModalService);
  private readonly duelStore = inject(DuelStore);

  selectedPlayer = signal<'player1' | 'player2'>('player1');

  hasDefaultBg = computed(() => this.settingsService.background() === 0);

  wins1 = computed(() => this.duelStore.wins1());
  wins2 = computed(() => this.duelStore.wins2());

  onLpSelect(player: 'player1' | 'player2') {
    if (this.selectedPlayer() !== player) {
      this.selectedPlayer.set(player);
    }
  }

  onLpClick(player: 'player1' | 'player2') {
    if (this.selectedPlayer() !== player) {
      this.selectedPlayer.set(player);
      return;
    }

    if (!this.settingsService.useRapidButtons()) return;
    this.modalService.open(LifePointsAdjustModalComponent, { size: 'sm' }, { player });
  }
}
