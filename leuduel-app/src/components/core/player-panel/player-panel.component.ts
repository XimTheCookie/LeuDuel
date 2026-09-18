import { Component, computed, inject, input, signal } from '@angular/core';
import { LifeAction } from '../../../models/life-action.model';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import { DamageButtonComponent } from '../../common/damage-button/damage-button.component';
import { SettingsService } from '../../../services/settings.service';
import { ModalService } from '../../../services/modal.service';
import { ModifyDamageButtonComponent } from '../modify-damage-button/modify-damage-button.component';

@Component({
  selector: 'app-player-panel',
  templateUrl: './player-panel.component.html',
  styleUrl: './player-panel.component.scss',
  standalone: true,
  imports: [DamageButtonComponent],
})
export class PlayerPanelComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly modalService = inject(ModalService);

  numberOfGamesArray = computed<number[]>(() => {
    const numberOfGames = this.settingsService.getNumberOfGames();
    return Array.from({ length: numberOfGames }, (_, i) => i + 1);
  });

  player = input.required<'player1' | 'player2'>();
  rapidButtons = computed(() => this.settingsService.rapidButtonsConfig());
  numberOfColumns = computed(() => this.settingsService.rapidButtonsColumns());

  duelStore = inject(DuelStore);

  get lifePoints() {
    return this.player() === 'player1'
      ? this.duelStore.lifePoints1()
      : this.duelStore.lifePoints2();
  }

  get wins() {
    return this.player() === 'player1' ? this.duelStore.wins1() : this.duelStore.wins2();
  }

  doModify = (index: number) => {
    const modalRef = this.modalService.open(
      ModifyDamageButtonComponent,
      { size: 'sm', mirror: this.player() === 'player2' },
      {
        action: { ...this.rapidButtons()[index] },
        onSave: (updated: LifeAction) => {
          this.settingsService.updateRapidButton(index, updated);
          modalRef.close();
        },
      },
    );
  };
}
