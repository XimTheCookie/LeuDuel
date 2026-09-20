import { Component, inject } from '@angular/core';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { CounterToolsComponent } from '../../components/core/counter-tools/counter-tools.component';
import { ToolsStore } from '../../stores/tools-store/tools.store';
import { SoundboardService } from '../../services/soundboard.service';

@Component({
  selector: 'app-counter-page',
  standalone: true,
  templateUrl: './counter-page.component.html',
  styleUrl: './counter-page.component.scss',
  imports: [CounterToolsComponent],
})
export class CounterPageComponent {
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
