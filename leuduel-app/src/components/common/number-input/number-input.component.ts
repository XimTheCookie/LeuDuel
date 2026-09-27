import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
})
export class NumberInputComponent {
  formControl = input.required<FormControl<number | null>>();
  label = input<string>('');
  step = input<number>(1);
  maxValue = input<number | null>(null);
  minValue = input<number | null>(null);
  canReset = input<boolean>(false);
  doReset = output<void>();

  hideButtons = input<boolean>(false);

  private coolingDown = false;

  increment() {
    if (this.coolingDown) return;
    this.triggerCooldown();
    this.setValue((this.formControl().value ?? 0) + this.step());
  }

  decrement() {
    if (this.coolingDown) return;
    this.triggerCooldown();
    this.setValue((this.formControl().value ?? 0) - this.step());
  }

  reset() {
    if (this.coolingDown) return;
    this.triggerCooldown();
    this.doReset.emit();
  }

  private triggerCooldown() {
    this.coolingDown = true;
    setTimeout(() => (this.coolingDown = false), 50);
  }

  private setValue(next: number) {
    const min = this.minValue();
    const max = this.maxValue();
    if (min !== null) next = Math.max(min, next);
    if (max !== null) next = Math.min(max, next);
    this.formControl().setValue(next);
  }

  get atMin() {
    const min = this.minValue();
    return min !== null && (this.formControl().value ?? 0) <= min;
  }

  get atMax() {
    const max = this.maxValue();
    return max !== null && (this.formControl().value ?? 0) >= max;
  }
}
