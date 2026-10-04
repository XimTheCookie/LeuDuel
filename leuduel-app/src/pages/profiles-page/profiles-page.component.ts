import { Component, inject } from '@angular/core';
import { PlayerStore } from '../../stores/player-store/player.store';
import { ModalService } from '../../services/modal/modal.service';
import { ProfileEditorComponent } from '../../components/core/profile-editor/profile-editor.component';
import { PlayerProfileComponent } from '../../components/core/player-profile/player-profile.component';
import { TextButtonComponent } from '../../components/common/text-button/text-button.component';
import { PlayerProfile } from '../../models/player-profile.modal';
import { SoundboardService } from '../../services/soundboard/soundboard.service';
import { ButtonComponent } from '../../components/common/button/button.component';
import { TranslatePipe } from '../../pipes/translate/translate.pipe';

@Component({
  selector: 'app-profiles-page',
  standalone: true,
  templateUrl: './profiles-page.component.html',
  styleUrls: ['./profiles-page.component.scss'],
  imports: [PlayerProfileComponent, TextButtonComponent, ButtonComponent, TranslatePipe],
})
export class ProfilesPageComponent {
  readonly playerStore = inject(PlayerStore);
  private readonly modalService = inject(ModalService);
  private readonly soundboardService = inject(SoundboardService);

  openMainEditor() {
    this.soundboardService.clickSound();
    this.modalService.open(ProfileEditorComponent, { size: 'md' }, { mode: 'main' });
  }

  openAddOpponent() {
    this.soundboardService.clickSound();
    this.modalService.open(ProfileEditorComponent, { size: 'md' }, { mode: 'opponent' });
  }

  openEditOpponent(opponent: PlayerProfile) {
    this.soundboardService.clickSound();
    this.modalService.open(ProfileEditorComponent, { size: 'md' }, { mode: 'opponent', opponent });
  }

  removeOpponent(id: number) {
    this.soundboardService.counterRemove();
    this.playerStore.removeOpponent(id);
  }
}
