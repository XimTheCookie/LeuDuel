import { Component } from '@angular/core';
import { DuelControllerComponent } from '../../components/core/duel-controller/duel-controller.component';
import { PlayerPanelComponent } from '../../components/core/player-panel/player-panel.component';

@Component({
  selector: 'app-duel-page',
  templateUrl: './duel-page.component.html',
  styleUrl: './duel-page.component.scss',
  imports: [PlayerPanelComponent, DuelControllerComponent],
  standalone: true,
})
export class DuelPageComponent {}
