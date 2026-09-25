import { Component, computed, inject, input } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-wins-bar',
  templateUrl: './wins-bar.component.html',
  styleUrl: './wins-bar.component.scss',
  standalone: true,
})
export class WinsBarComponent {
  private readonly settingsService = inject(SettingsService);

  wins = input.required<number>();

  numberOfGamesArray = computed<number[]>(() => {
    const n = this.settingsService.getNumberOfGames();
    return Array.from({ length: n }, (_, i) => i + 1);
  });
}
