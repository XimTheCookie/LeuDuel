import { Component, computed, Inject, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MODAL_COMPONENT_DATA } from '../../../services/modal.service';
import { PlayerStore } from '../../../stores/player-store/player.store';
import { CardSearchComponent } from '../../common/card-search/card-search.component';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { PlayerProfileComponent } from '../player-profile/player-profile.component';
import { YgoCard } from '../../../models/ygo-card.model';
import { PlayerProfile } from '../../../models/player-profile.modal';
import {
  MODAL_DATA,
  ModalGenericComponent,
} from '../../common/modal-generic/modal-generic.component';
import { SoundboardService } from '../../../services/soundboard.service';

export interface ProfileEditorData {
  mode: 'main' | 'opponent';
  opponent?: PlayerProfile;
}

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss'],
  standalone: true,
  imports: [FormsModule, CardSearchComponent, TextButtonComponent, PlayerProfileComponent],
})
export class ProfileEditorComponent implements OnInit {
  private readonly playerStore = inject(PlayerStore);
  private readonly soundboardService = inject(SoundboardService);
  readonly data = inject<ProfileEditorData>(MODAL_COMPONENT_DATA);

  displayName = signal('');
  selectedCardUrl = signal<string | null>(null);

  preview = computed<PlayerProfile>(() => ({
    id: 0,
    displayName: this.displayName() || '…',
    card: this.selectedCardUrl() ?? null,
  }));

  constructor(
    @Inject(MODAL_DATA) private modalData: InstanceType<typeof ModalGenericComponent>['data'],
    @Inject(MODAL_COMPONENT_DATA) private onConfirm: () => void,
  ) {}

  ngOnInit() {
    if (this.data.mode === 'main') {
      const main = this.playerStore.main();
      this.displayName.set(main?.displayName ?? '');
      this.selectedCardUrl.set(main?.card ?? null);
    } else if (this.data.opponent) {
      this.displayName.set(this.data.opponent.displayName);
      this.selectedCardUrl.set(this.data.opponent.card);
    }
  }

  onCardSelected(card: YgoCard) {
    this.soundboardService.clickSound();
    this.selectedCardUrl.set(card.card_images?.[0]?.image_url_small ?? null);
  }

  clearCard() {
    this.soundboardService.counterSound();
    this.selectedCardUrl.set(null);
  }

  canSave() {
    return this.displayName().trim().length > 0;
  }

  save() {
    this.soundboardService.confirmationSound();
    const name = this.displayName().trim();
    const card = this.selectedCardUrl() ?? undefined;
    if (this.data.mode === 'main') {
      this.playerStore.setProfile(name, card);
    } else if (this.data.opponent) {
      this.playerStore.updateOpponent(this.data.opponent.id, name, card);
    } else {
      this.playerStore.addOpponent(name, card);
    }
    this.modalData.overlayRef.dispose();
  }
}
