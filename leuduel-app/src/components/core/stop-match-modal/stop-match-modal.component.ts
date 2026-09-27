import { Component, computed, inject, Inject } from '@angular/core';
import { MODAL_COMPONENT_DATA } from '../../../services/modal/modal.service';
import { DuelStore } from '../../../stores/duel-store/duel.store';
import {
  MODAL_DATA,
  ModalGenericComponent,
} from '../../common/modal-generic/modal-generic.component';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { SettingsService } from '../../../services/settings/settings.service';
import { PlayerProfile } from '../../../models/player-profile.modal';
import { PlayerProfileComponent } from '../player-profile/player-profile.component';

@Component({
  selector: 'app-stop-match-modal',
  standalone: true,
  imports: [TextButtonComponent, PlayerProfileComponent],
  templateUrl: './stop-match-modal.component.html',
  styleUrls: ['./stop-match-modal.component.scss'],
})
export class StopMatchModalComponent {
  duelStore = inject(DuelStore);
  private readonly settingsService = inject(SettingsService);

  hasPossibleWinner = computed(() => {
    return this.duelStore.wins1() > 0 || this.duelStore.wins2() > 0;
  });

  winnerInfo = computed(() => {
    const w1 = this.duelStore.wins1();
    const w2 = this.duelStore.wins2();
    if (w1 === w2) return { isDraw: true, leader: null };
    return { isDraw: false, leader: w1 > w2 ? 'player1' : 'player2' };
  });

  displayProfile = computed<PlayerProfile | undefined>(() => {
    if (!this.settingsService.showCustomPlayers()) return undefined;
    const winnerInfo = this.winnerInfo();
    if (winnerInfo.leader === 'player1') return this.duelStore.player1().profile;
    else if (winnerInfo.leader === 'player2') return this.duelStore.player2().profile;
    return undefined;
  });

  displayName1 = computed(() => {
    const player = this.duelStore.player1();
    if (this.settingsService.showCustomPlayers())
      return player?.profile?.displayName ?? player.name;
    return player.name;
  });

  displayName2 = computed(() => {
    const player = this.duelStore.player2();
    if (this.settingsService.showCustomPlayers())
      return player?.profile?.displayName ?? player.name;
    return player.name;
  });

  constructor(
    @Inject(MODAL_DATA) private modalData: InstanceType<typeof ModalGenericComponent>['data'],
    @Inject(MODAL_COMPONENT_DATA) private onConfirm: () => void,
  ) {}

  confirm() {
    this.onConfirm();
    this.modalData.overlayRef.dispose();
  }

  cancel() {
    this.modalData.overlayRef.dispose();
  }
}
