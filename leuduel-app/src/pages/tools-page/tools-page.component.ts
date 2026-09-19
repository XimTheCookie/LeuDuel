import { Component, inject } from '@angular/core';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { PlayerToolsComponent } from '../../components/core/player-tools/player-tools.component';
import { ToolsStore } from '../../stores/tools-store/tools.store';
import { SoundboardService } from '../../services/soundboard.service';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  templateUrl: './tools-page.component.html',
  styleUrl: './tools-page.component.scss',
  imports: [PlayerToolsComponent],
})
export class ToolsPageComponent {
  private readonly modalData = inject(MODAL_DATA);
  private readonly soundboardService = inject(SoundboardService);
  readonly toolsStore = inject(ToolsStore);

  emz() {
    return this.toolsStore.emz();
  }

  onEmzPress(i: 0 | 1, event: MouseEvent | TouchEvent) {
    this.soundboardService.clickSound();
    event.preventDefault();
    if (event instanceof MouseEvent && event.button === 2) {
      this.toolsStore.removeEmz(i);
    } else {
      this.toolsStore.addEmz(i);
    }
  }

  onEmzContextMenu(i: 0 | 1, event: MouseEvent) {
    event.preventDefault();
    this.toolsStore.removeEmz(i);
  }

  close() {
    this.modalData.overlayRef.dispose();
  }
}
