import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Inject, inject, Type } from '@angular/core';
import { ModalConfig } from '../../../services/modal.service';
import { SettingsService } from '../../../services/settings.service';
import { MODAL_DATA } from '../../common/modal-generic/modal-generic.component';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { SoundboardService } from '../../../services/soundboard.service';

@Component({
  selector: 'welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss'],
  standalone: true,
  imports: [TextButtonComponent],
})
export class WelcomeModalComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly settingsService = inject(SettingsService);

  constructor(
    @Inject(MODAL_DATA)
    private readonly modalData: {
      component: Type<unknown>;
      config: ModalConfig;
      overlayRef: OverlayRef;
    },
  ) {}

  selectMode(landscape: boolean) {
    this.soundboardService.clickSound();
    this.settingsService.setLandscapeMode(landscape);
    this.modalData.overlayRef.dispose();
  }
}
