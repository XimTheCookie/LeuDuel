import { Component, computed, input } from '@angular/core';
import {
  LucideArrowDown,
  LucideArrowLeft,
  LucideArrowRight,
  LucideArrowUp,
  LucideBan,
  LucideBookOpen,
  LucideCheck,
  LucideCircleQuestionMark,
  LucideCoins,
  LucideDices,
  LucideDynamicIcon,
  LucideHeartPulse,
  LucideInfo,
  LucideMinus,
  LucidePalette,
  LucidePause,
  LucidePencil,
  LucideShuffle,
  LucidePlay,
  LucidePlus,
  LucideRotateCcw,
  LucideScrollText,
  LucideSettings,
  LucideSlidersHorizontal,
  LucideSmartphone,
  LucideSwords,
  LucideVolume2,
  LucideVolumeOff,
  LucideX,
  LucideOctagonMinus,
  LucideCircleMinus,
  LucideAstroid,
  LucideSquaresExclude,
  LucideClipboardList,
  LucideCircleArrowUp,
  LucideCircleArrowDown,
} from '@lucide/angular';

const ICON_MAP: Record<string, any> = {
  play: LucidePlay,
  pause: LucidePause,
  log: LucideScrollText,
  rules: LucideBookOpen,
  reset: LucideRotateCcw,
  settings: LucideSettings,
  check: LucideCheck,
  plus: LucidePlus,
  minus: LucideMinus,
  'heart-reset': LucideHeartPulse,
  x: LucideX,
  'arrow-down': LucideArrowDown,
  astroid: LucideAstroid,
  'arrow-up': LucideArrowUp,
  'arrow-left': LucideArrowLeft,
  'octagon-minus': LucideOctagonMinus,
  'circle-minus': LucideCircleMinus,
  'arrow-right': LucideArrowRight,
  ban: LucideBan,
  dices: LucideDices,
  volume: LucideVolume2,
  'volume-off': LucideVolumeOff,
  coins: LucideCoins,
  edit: LucidePencil,
  swords: LucideSwords,
  palette: LucidePalette,
  smartphone: LucideSmartphone,
  'sliders-horizontal': LucideSlidersHorizontal,
  'circle-question-mark': LucideCircleQuestionMark,
  shuffle: LucideShuffle,
  info: LucideInfo,
  'clipboard-list': LucideClipboardList,
  'circle-arrow-up': LucideCircleArrowUp,
  'circle-arrow-down': LucideCircleArrowDown,
};

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  imports: [LucideDynamicIcon],
})
export class IconComponent {
  icon = input<string>();
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md');

  filled = input<boolean>(false);

  readonly sizeMap = { xs: '0.708rem', sm: '1rem', md: '1.25rem', lg: '1.75rem' };
  sizeValue = computed(() => {
    return this.sizeMap[this.size()];
  });

  iconValue = computed(() => {
    const icon = this.icon();
    if (!icon) return null;
    const value = ICON_MAP[icon];
    if (value) return value;
    return LucideSquaresExclude;
  });
}
