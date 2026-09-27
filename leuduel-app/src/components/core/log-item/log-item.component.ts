import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LifeChange } from '../../../models/life-change.model';
import { IconComponent } from '../../common/icon/icon.component';
import { PlayerProfile } from '../../../models/player-profile.modal';
import { PlayerProfileComponent } from '../player-profile/player-profile.component';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

@Component({
  selector: 'app-log-item',
  standalone: true,
  templateUrl: './log-item.component.html',
  styleUrls: ['./log-item.component.scss'],
  imports: [DatePipe, IconComponent, PlayerProfileComponent, TranslatePipe],
})
export class LogItemComponent {
  playerProfile1 = input<PlayerProfile>();
  playerProfile2 = input<PlayerProfile>();

  lifeLog = input.required<LifeChange>();
  undoable = input<boolean>(true);
  undo = output<number>();

  displayProfile = computed(() => {
    const log = this.lifeLog();
    if (log.player === 'Player 1') return this.playerProfile1();
    if (log.player === 'Player 2') return this.playerProfile2();
    return undefined;
  });
}
