import { Component, computed, inject, input } from '@angular/core';
import { LifeAction } from '../../../models/life-action.model';
import { SettingsService } from '../../../services/settings/settings.service';
import { ModalService } from '../../../services/modal/modal.service';
import { DamageButtonComponent } from '../../common/damage-button/damage-button.component';
import { ModifyDamageButtonComponent } from '../modify-damage-button/modify-damage-button.component';

@Component({
  selector: 'app-landscape-actions',
  templateUrl: './landscape-actions.component.html',
  styleUrl: './landscape-actions.component.scss',
  standalone: true,
  imports: [DamageButtonComponent],
})
export class LandscapeActionsComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly modalService = inject(ModalService);

  selectedPlayer = input.required<'player1' | 'player2'>();
  rapidButtons = computed(() => this.settingsService.rapidButtonsConfig());
  numberOfColumns = computed(() => this.settingsService.rapidButtonsColumns());

  doModify(index: number) {
    const modalRef = this.modalService.open(
      ModifyDamageButtonComponent,
      { size: 'sm' },
      {
        action: { ...this.rapidButtons()[index] },
        onSave: (updated: LifeAction) => {
          this.settingsService.updateRapidButton(index, updated);
          modalRef.close();
        },
      },
    );
  }
}
