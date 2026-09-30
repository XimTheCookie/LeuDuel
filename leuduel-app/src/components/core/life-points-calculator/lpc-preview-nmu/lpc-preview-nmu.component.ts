import { Component, input } from '@angular/core';

type Op = 'damage' | 'heal';

@Component({
  selector: 'app-lpc-preview-nmu',
  templateUrl: './lpc-preview-nmu.component.html',
  styleUrls: ['./lpc-preview-nmu.component.scss'],
  standalone: true,
})
export class LpcPreviewNmuComponent {
  currentLp = input.required<number>();
  op = input.required<Op>();
  inputVal = input.required<string>();
  preview = input.required<number>();
  sle = input<boolean>(false);
}
