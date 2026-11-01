import { Component, computed, inject, input } from '@angular/core';
import { ModalService } from '../../../services/modal/modal.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { WinsBarComponent } from '../../common/wins-bar/wins-bar.component';
import { LifePointsAdjustModalComponent } from '../life-points-adjust-modal/life-points-adjust-modal.component';
import { LifePointsComponent } from '../life-points/life-points.component';
import { LpPanelComponent } from '../lp-panel/lp-panel.component';

@Component({
  selector: 'app-player-panel',
  templateUrl: './player-panel.component.html',
  styleUrl: './player-panel.component.scss',
  standalone: true,
  imports: [LifePointsComponent, WinsBarComponent, LpPanelComponent],
})
export class PlayerPanelComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly modalService = inject(ModalService);

  player = input.required<'player1' | 'player2'>();

  hasDefaultBg = computed(() => this.settingsService.background() === 0);

  duelStore = inject(DuelStore);

  get wins() {
    return this.player() === 'player1' ? this.duelStore.wins1() : this.duelStore.wins2();
  }

  modifyLp() {
    if (!this.settingsService.useRapidButtons()) return;
    this.modalService.open(
      LifePointsAdjustModalComponent,
      {
        size: 'sm',
        mirror: this.player() === 'player2',
      },
      { player: this.player() },
    );
  }
}
