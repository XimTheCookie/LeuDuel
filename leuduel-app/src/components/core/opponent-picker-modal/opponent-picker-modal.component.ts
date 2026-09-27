import { Component, inject, Inject, signal } from '@angular/core';
import { MODAL_COMPONENT_DATA } from '../../../services/modal/modal.service';
import {
  MODAL_DATA,
  ModalGenericComponent,
} from '../../common/modal-generic/modal-generic.component';
import { PlayerStore } from '../../../stores/player-store/player.store';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { PlayerProfileComponent } from '../player-profile/player-profile.component';
import { PlayerProfile } from '../../../models/player-profile.modal';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

@Component({
  selector: 'app-opponent-picker-modal',
  standalone: true,
  imports: [TextButtonComponent, PlayerProfileComponent, TranslatePipe],
  templateUrl: './opponent-picker-modal.component.html',
  styleUrls: ['./opponent-picker-modal.component.scss'],
})
export class OpponentPickerModalComponent {
  readonly playerStore = inject(PlayerStore);

  selected = signal<PlayerProfile | null>(this.playerStore.opponents()[0] ?? null);

  constructor(
    @Inject(MODAL_DATA) private modalData: InstanceType<typeof ModalGenericComponent>['data'],
    @Inject(MODAL_COMPONENT_DATA) private onConfirm: (opponentId?: number) => void,
  ) {}

  select(opponent: PlayerProfile) {
    this.selected.set(opponent);
  }

  confirm() {
    this.onConfirm(this.selected()?.id);
    this.modalData.overlayRef.dispose();
  }

  cancel() {
    this.modalData.overlayRef.dispose();
  }
}
