import { Component, computed, inject, input } from '@angular/core';
import { SettingsService } from '../../../services/settings/settings.service';

@Component({
  selector: 'app-wins-bar',
  templateUrl: './wins-bar.component.html',
  styleUrl: './wins-bar.component.scss',
  standalone: true,
})
export class WinsBarComponent {
  private readonly settingsService = inject(SettingsService);
  hasDefaultBg = computed(() => this.settingsService.background() === 0);

  wins = input.required<number>();

  numberOfGamesArray = computed<number[]>(() => {
    const n = Math.ceil(this.settingsService.getNumberOfGames() / 2);
    return Array.from({ length: n }, (_, i) => i + 1);
  });
}
