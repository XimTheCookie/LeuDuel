import { Component, input } from '@angular/core';

type Op = 'damage' | 'heal';

@Component({
  selector: 'app-lpc-preview-default',
  templateUrl: './lpc-preview-default.component.html',
  styleUrls: ['./lpc-preview-default.component.scss'],
  standalone: true,
})
export class LpcPreviewDefaultComponent {
  currentLp = input.required<number>();
  op = input.required<Op>();
  inputVal = input.required<string>();
  preview = input.required<number>();
}
