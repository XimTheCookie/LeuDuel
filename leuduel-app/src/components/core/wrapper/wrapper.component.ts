import { Component, inject, computed, signal } from '@angular/core';
import { DuelPageComponent } from '../../../pages/duel-page/duel-page.component';
import { SettingsService } from '../../../services/settings/settings.service';
import { LinesWallpaperComponent } from '../../common/wallpaper/lines-wallpaper/lines-wallpaper.component';
import { SnowWallpaperComponent } from '../../common/wallpaper/snow-wallpaper/snow-wallpaper.component';
import { EmbersWallpaperComponent } from '../../common/wallpaper/embers-wallpaper/embers-wallpaper.component';
import { RainWallpaperComponent } from '../../common/wallpaper/rain-wallpaper/rain-wallpaper.component';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  imports: [
    DuelPageComponent,
    LinesWallpaperComponent,
    SnowWallpaperComponent,
    EmbersWallpaperComponent,
    RainWallpaperComponent,
  ],
})
export class WrapperComponent {
  settingsService = inject(SettingsService);
  background = computed(() => this.settingsService.background());

  documentVisible = signal<boolean>(true);

  constructor() {
    document.addEventListener('visibilitychange', () => {
      this.documentVisible.set(document.visibilityState === 'visible');
    });
  }
}
