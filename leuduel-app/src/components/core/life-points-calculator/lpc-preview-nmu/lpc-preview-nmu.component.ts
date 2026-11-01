import { Component, inject, input } from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

type Op = 'damage' | 'heal';

@Component({
  selector: 'app-lpc-preview-nmu',
  templateUrl: './lpc-preview-nmu.component.html',
  styleUrls: ['./lpc-preview-nmu.component.scss'],
  standalone: true,
})
export class LpcPreviewNmuComponent {
  readonly settingsService = inject(SettingsService);
  currentLp = input.required<number>();
  op = input.required<Op>();
  inputVal = input.required<string>();
  preview = input.required<number>();
  sle = input<boolean>(false);
}
