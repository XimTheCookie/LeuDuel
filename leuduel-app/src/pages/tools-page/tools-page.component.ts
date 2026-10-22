import { Component, inject } from '@angular/core';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { PlayerToolsComponent } from '../../components/core/player-tools/player-tools.component';
import { SettingsService } from '../../services/settings/settings.service';
import { IconComponent } from '../../components/common/icon/icon.component';
import { ModalService } from '../../services/modal/modal.service';
import { PlayerRandomizerPageComponent } from '../player-randomizer-page/player-randomizer-page.component';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  templateUrl: './tools-page.component.html',
  styleUrl: './tools-page.component.scss',
  imports: [PlayerToolsComponent, IconComponent],
})
export class ToolsPageComponent {
  private readonly modalData = inject(MODAL_DATA);
  readonly settingsService = inject(SettingsService);
  private readonly modalService = inject(ModalService);

  close() {
    this.modalData.overlayRef.dispose();
  }

  openPlayerPicker() {
    this.modalService.open(PlayerRandomizerPageComponent, {
      size: 'full',
      hideClose: true,
    });
  }
}
