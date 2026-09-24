import { Component, input } from '@angular/core';
import { PlayerProfile } from '../../../models/player-profile.modal';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
  imports: [],
  standalone: true,
})
export class PlayerProfileComponent {
  profile = input.required<PlayerProfile>();
  showName = input<boolean>(true);
  showAvatar = input<boolean>(true);

  small = input<boolean>(false);
}
