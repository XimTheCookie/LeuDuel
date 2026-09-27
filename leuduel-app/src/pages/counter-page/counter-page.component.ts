import { Component, inject } from '@angular/core';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { CounterToolsComponent } from '../../components/core/counter-tools/counter-tools.component';
import { CounterToolsLandscapeComponent } from '../../components/core/counter-tools-landscape/counter-tools-landscape.component';
import { ToolsStore } from '../../stores/tools-store/tools.store';
import { SoundboardService } from '../../services/soundboard/soundboard.service';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-counter-page',
  standalone: true,
  templateUrl: './counter-page.component.html',
  styleUrl: './counter-page.component.scss',
  imports: [CounterToolsComponent, CounterToolsLandscapeComponent],
})
export class CounterPageComponent {
  private readonly modalData = inject(MODAL_DATA);
  private readonly soundboardService = inject(SoundboardService);
  readonly toolsStore = inject(ToolsStore);
  readonly settingsService = inject(SettingsService);

  emz() {
    return this.toolsStore.emz();
  }

  onEmzPress(i: 0 | 1, event: MouseEvent | TouchEvent) {
    this.soundboardService.counterSound();
    event.preventDefault();
    if (event instanceof MouseEvent && event.button === 2) {
      this.toolsStore.removeEmz(i);
    } else {
      this.toolsStore.addEmz(i);
    }
  }

  onEmzContextMenu(i: 0 | 1, event: MouseEvent) {
    this.soundboardService.clickSound();
    event.preventDefault();
    this.toolsStore.removeEmz(i);
  }

  close() {
    this.modalData.overlayRef.dispose();
  }
}
