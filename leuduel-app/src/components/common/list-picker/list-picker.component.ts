import { Component, input, output, signal, ElementRef, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-list-picker',
  templateUrl: './list-picker.component.html',
  styleUrls: ['./list-picker.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
})
export class ListPickerComponent {
  formControl = input.required<FormControl<string | number | boolean | null>>();
  options = input.required<{ label: string; value: string | number | boolean | null }[]>();
  label = input<string>('');
  canReset = input<boolean>(false);
  disabled = input<boolean>(false);
  doReset = output<void>();

  valueChanged = output<void>();

  isOpen = signal(false);
  private dragStartY = 0;
  dragDelta = signal(0);

  get optionLabel() {
    return this.options().find((o) => o.value === this.formControl().value)?.label ?? '';
  }

  open() {
    this.isOpen.set(true);
  }

  select(option: string | number | boolean | null) {
    this.formControl().setValue(option);
    this.isOpen.set(false);
    this.valueChanged.emit();
  }

  close() {
    this.isOpen.set(false);
    this.dragDelta.set(0);
  }

  onHandleTouchStart(e: TouchEvent) {
    this.dragStartY = e.touches[0].clientY;
    this.dragDelta.set(0);
  }

  onHandleTouchMove(e: TouchEvent) {
    const delta = Math.max(0, e.touches[0].clientY - this.dragStartY);
    this.dragDelta.set(delta);
  }

  onHandleTouchEnd() {
    if (this.dragDelta() > 80) {
      this.close();
    } else {
      this.dragDelta.set(0);
    }
  }

  get sheetTransform() {
    return this.dragDelta() > 0 ? `translateY(${this.dragDelta()}px)` : '';
  }
}
