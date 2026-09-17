import { Component, computed, input } from '@angular/core';
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideBan,
  LucideBookOpen,
  LucideCheck,
  LucideDynamicIcon,
  LucideHeartPulse,
  LucideMinus,
  LucidePause,
  LucidePlay,
  LucidePlus,
  LucideRotateCcw,
  LucideScrollText,
  LucideSettings,
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
  size = input<'sm' | 'md' | 'lg'>('md');

  readonly sizeMap = { sm: '1rem', md: '1.25rem', lg: '1.75rem' };
  get sizeValue() { return this.sizeMap[this.size()]; }

  iconValue = computed(() => {
    const icon = this.icon();
    if (!icon) return null;
    switch (icon) {
      case 'play':    return LucidePlay;
      case 'pause':   return LucidePause;
      case 'log':     return LucideScrollText;
      case 'rules':   return LucideBookOpen;
      case 'reset':   return LucideRotateCcw;
      case 'settings': return LucideSettings;
      case 'check':   return LucideCheck;
      case 'plus':    return LucidePlus;
      case 'minus':   return LucideMinus;
      case 'heart-reset': return LucideHeartPulse;
      case 'x':         return LucideX;
      case 'arrow-down': return LucideArrowDown;
      case 'arrow-up':   return LucideArrowUp;
      case 'ban':        return LucideBan;
    }
    return LucideX;
  });
}
