import { Component, inject } from '@angular/core';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { CounterToolsLandscapeComponent } from '../../components/core/counter-tools-landscape/counter-tools-landscape.component';
import { CounterToolsComponent } from '../../components/core/counter-tools/counter-tools.component';
import { SettingsService } from '../../services/settings/settings.service';
import { ToolsStore } from '../../stores/tools-store/tools.store';
import { ModalService } from '../../services/modal/modal.service';
import { CounterAdjustModalComponent } from '../../components/core/counter-adjust-modal/counter-adjust-modal.component';
import { CounterEvent } from '../../models/counter-event.model';

@Component({
  selector: 'app-counter-page',
  standalone: true,
  templateUrl: './counter-page.component.html',
  styleUrl: './counter-page.component.scss',
  imports: [CounterToolsComponent, CounterToolsLandscapeComponent],
})
export class CounterPageComponent {
  private readonly modalData = inject(MODAL_DATA);
  readonly toolsStore = inject(ToolsStore);
  readonly settingsService = inject(SettingsService);
  readonly modalService = inject(ModalService);

  emz() {
    return this.toolsStore.emz();
  }

  onEmzPress(i: 0 | 1) {
    const event: CounterEvent = {
      type: 'emz',
      player: 1,
      index: i,
    };
    this.setCounters(event);
  }

  setCounters(event: CounterEvent) {
    this.modalService.open(CounterAdjustModalComponent, {
      size: 'sm',
      hideClose: !this.settingsService.landscapeMode(),
      custom: {
        event,
      },
    });
  }

  close() {
    this.modalData.overlayRef.dispose();
  }
}
