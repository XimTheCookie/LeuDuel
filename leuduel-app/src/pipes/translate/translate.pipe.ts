import { inject, Pipe } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';
import { TranslateService } from '../../services/translate/translate.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe {
  private readonly translateService = inject(TranslateService);
  private readonly settingsService = inject(SettingsService);

  transform(path: string, placeholders?: Record<string, string>): string {
    this.settingsService.language(); // track signal for re-evaluation
    return this.translateService.translate(path, placeholders);
  }
}
