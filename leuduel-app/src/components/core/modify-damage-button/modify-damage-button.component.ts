import { Component, computed, inject, Inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NumberInputComponent } from '../../common/number-input/number-input.component';
import { LifeAction } from '../../../models/life-action.model';
import { MODAL_COMPONENT_DATA } from '../../../services/modal/modal.service';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

export interface ModifyDamageData {
  action: LifeAction;
  onSave: (action: LifeAction) => void;
}

const ACTION_TYPES: { type: LifeAction['type']; label: string; symbol: string }[] = [
  { type: 'damage', label: 'common.label.damage', symbol: '-' },
  { type: 'heal', label: 'common.label.heal', symbol: '+' },
  { type: 'divide', label: 'common.label.divide', symbol: '/' },
  { type: 'multiply', label: 'common.label.multiply', symbol: '×' },
  { type: 'set', label: 'common.label.set', symbol: '=' },
];

@Component({
  selector: 'app-modify-damage-button',
  standalone: true,
  templateUrl: './modify-damage-button.component.html',
  styleUrls: ['./modify-damage-button.component.scss'],
  imports: [NumberInputComponent, TextButtonComponent, TranslatePipe],
})
export class ModifyDamageButtonComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly soundboardService = inject(SoundboardService);
  readonly actionTypes = ACTION_TYPES;

  landscapeMode = computed(() => this.settingsService.landscapeMode());

  buttonValueController = new FormControl<number | null>(1, [
    Validators.required,
    Validators.min(1),
    Validators.max(99999),
  ]);

  selectedType = signal<LifeAction['type']>('damage');

  constructor(@Inject(MODAL_COMPONENT_DATA) public data: ModifyDamageData) {
    this.buttonValueController.setValue(data.action.change);
    this.selectedType.set(data.action.type);
  }

  selectType(type: LifeAction['type']) {
    this.selectedType.set(type);
    this.soundboardService.clickSound();
  }

  save() {
    if (this.buttonValueController.invalid) return;
    this.soundboardService.confirmationSound();
    this.data.onSave({ change: this.buttonValueController.value!, type: this.selectedType() });
  }
}
