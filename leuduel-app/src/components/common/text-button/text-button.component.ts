import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-text-button',
  templateUrl: './text-button.component.html',
  styleUrls: ['./text-button.component.scss'],
  standalone: true,
})
export class TextButtonComponent {
  isDisabled = input<boolean>(false);
  tone = input<'neutral' | 'positive' | 'negative' | 'warning'>('neutral');
  label = input<string>('');

  clicked = output<void>();

  cooldown = input<number>(50);

  coolingDown = signal<boolean>(false);

  clickHandler() {
    if (this.coolingDown() || this.isDisabled()) {
      return;
    }
    this.coolingDown.set(true);
    setTimeout(() => {
      this.coolingDown.set(false);
    }, this.cooldown());
    this.clicked.emit();
  }
}
