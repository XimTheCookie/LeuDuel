import { Component, inject, Inject, signal } from '@angular/core';
import { MODAL_COMPONENT_DATA } from '../../../services/modal/modal.service';
import { MODAL_DATA, ModalGenericComponent } from '../modal-generic/modal-generic.component';
import { TextButtonComponent } from '../text-button/text-button.component';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
  standalone: true,
  imports: [TextButtonComponent],
})
export class InfoModalComponent {
  private readonly soundboardService = inject(SoundboardService);
  infoText = signal<string>('');

  constructor(
    @Inject(MODAL_DATA) private modalData: InstanceType<typeof ModalGenericComponent>['data'],
    @Inject(MODAL_COMPONENT_DATA) data: { info: string },
  ) {
    this.infoText.set(data.info);
  }

  close() {
    this.soundboardService.clickSound();
    this.modalData.overlayRef.dispose();
  }
}
