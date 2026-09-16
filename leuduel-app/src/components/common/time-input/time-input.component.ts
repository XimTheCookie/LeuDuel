import { Component, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  standalone: true,
  imports: [IconComponent],
})
export class TimeInputComponent {
  formControl = input.required<FormControl<number | null>>();
  label = input<string>('');
  canReset = input<boolean>(false);
  doReset = output<void>();

  private coolingDown = false;

  get hours()   { return Math.floor((this.ms) / 3_600_000); }
  get minutes() { return Math.floor((this.ms % 3_600_000) / 60_000); }
  get seconds() { return Math.floor((this.ms % 60_000) / 1_000); }

  private get ms() { return this.formControl().value ?? 0; }

  adjustHours(delta: number)   { this.adjust(delta * 3_600_000); }
  adjustMinutes(delta: number) { this.adjust(delta * 60_000); }
  adjustSeconds(delta: number) { this.adjust(delta * 1_000); }

  private adjust(delta: number) {
    if (this.coolingDown) return;
    this.coolingDown = true;
    setTimeout(() => (this.coolingDown = false), 50);
    const next = Math.max(0, this.ms + delta);
    this.formControl().setValue(next);
    this.formControl().markAsTouched();
  }

  reset() {
    this.doReset.emit();
  }

  pad(n: number) { return String(n).padStart(2, '0'); }
}
