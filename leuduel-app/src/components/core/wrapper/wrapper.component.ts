import { Component, inject, computed } from '@angular/core';
import { DuelPageComponent } from '../../../pages/duel-page/duel-page.component';
import { SettingsService } from '../../../services/settings/settings.service';
import { StarsWallpaperComponent } from '../../common/wallpaper/stars-wallpaper/stars-wallpaper.component';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  imports: [DuelPageComponent, StarsWallpaperComponent],
})
export class WrapperComponent {
  settingsService = inject(SettingsService);
  background = computed(() => this.settingsService.background());
}
