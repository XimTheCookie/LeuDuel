import { Component, inject } from '@angular/core';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { PlayerToolsComponent } from '../../components/core/player-tools/player-tools.component';
import { ModalService } from '../../services/modal.service';
import { CounterPageComponent } from '../counter-page/counter-page.component';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  templateUrl: './tools-page.component.html',
  styleUrl: './tools-page.component.scss',
  imports: [PlayerToolsComponent],
})
export class ToolsPageComponent {
  private readonly modalData = inject(MODAL_DATA);
  private readonly modalService = inject(ModalService);

  openCounterPage() {
    this.modalService.open(CounterPageComponent, {
      size: 'full',
      opacity: 0.7,
      hideClose: true,
    });
  }

  close() {
    this.modalData.overlayRef.dispose();
  }
}
