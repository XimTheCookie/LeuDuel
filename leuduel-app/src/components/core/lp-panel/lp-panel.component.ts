import { Component, computed, inject, input } from '@angular/core';
import { LifePointsCalculatorComponent } from '../life-points-calculator/life-points-calculator.component';
import { DamageButtonComponent } from '../../common/damage-button/damage-button.component';
import { SettingsService } from '../../../services/settings/settings.service';
import { ModifyDamageButtonComponent } from '../modify-damage-button/modify-damage-button.component';
import { LifeAction } from '../../../models/life-action.model';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-lp-panel',
  templateUrl: './lp-panel.component.html',
  styleUrls: ['./lp-panel.component.scss'],
  imports: [LifePointsCalculatorComponent, DamageButtonComponent],
  standalone: true,
})
export class LpPanelComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly modalService = inject(ModalService);

  player = input.required<'player1' | 'player2'>();
  rapidButtons = computed(() => this.settingsService.rapidButtonsConfig());
  numberOfColumns = computed(() => this.settingsService.rapidButtonsColumns());
  numberOfRows = computed(() =>
    Math.max(3, Math.ceil(this.rapidButtons().length / this.numberOfColumns())),
  );

  useButtonOpacity = computed(() => this.settingsService.background() !== 0);

  useRapidButtons = computed(() => this.settingsService.useRapidButtons());

  doModify = (index: number) => {
    const isMirror = this.player() === 'player2' && this.settingsService.monoControls() === false;
    const modalRef = this.modalService.open(
      ModifyDamageButtonComponent,
      {
        size: 'sm',
        mirror: isMirror,
      },
      {
        action: { ...this.rapidButtons()[index] },
        onSave: (updated: LifeAction) => {
          this.settingsService.updateRapidButton(index, updated);
          modalRef.close();
        },
        mirror: isMirror,
      },
    );
  };
}
