import { Component, inject } from '@angular/core';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { PlayerToolsComponent } from '../../components/core/player-tools/player-tools.component';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  templateUrl: './tools-page.component.html',
  styleUrl: './tools-page.component.scss',
  imports: [PlayerToolsComponent],
})
export class ToolsPageComponent {
  private readonly modalData = inject(MODAL_DATA);
  readonly settingsService = inject(SettingsService);

  close() {
    this.modalData.overlayRef.dispose();
  }
}
