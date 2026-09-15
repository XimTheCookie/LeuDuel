import { Component, computed, input } from '@angular/core';
import {
  LucideBookOpen,
  LucideDynamicIcon,
  LucideLogs,
  LucidePause,
  LucidePlay,
  LucideRotateCcw,
  LucideScrollText,
  LucideX,
} from '@lucide/angular';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  imports: [LucideDynamicIcon],
})
export class IconComponent {
  icon = input<string>();
  iconValue = computed(() => {
    const icon = this.icon();
    if (!icon) return null;
    switch (icon) {
      case 'play':
        return LucidePlay;
      case 'pause':
        return LucidePause;
      case 'log':
        return LucideScrollText;
      case 'rules':
        return LucideBookOpen;
      case 'reset':
        return LucideRotateCcw;
    }
    return LucideX;
  });
}
