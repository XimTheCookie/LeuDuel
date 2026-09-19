import { Component, input, output, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: true,
  imports: [IconComponent],
})
export class ButtonComponent {
  isDisabled = input<boolean>(false);
  size = input<'xs' | 'sm' | 'md' | 'xl'>('md');
  tone = input<'neutral' | 'positive' | 'negative' | 'warning'>('neutral');
  icon = input<string>();
  label = input<string>('');

  clicked = output<void>();

  cooldown = input<number>(100);

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
