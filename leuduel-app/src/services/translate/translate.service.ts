import { inject, Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private readonly settingsService = inject(SettingsService);

  private readonly fallBackLanguage = 'en_GB';
  private translations: Record<string, Record<string, unknown>> = {};

  async loadTranslations(): Promise<void> {
    await this.settingsService.ready;
    const lang = this.settingsService.language();
    const toLoad = lang === this.fallBackLanguage ? [lang] : [lang, this.fallBackLanguage];
    await Promise.all(toLoad.map((l) => this.loadLanguage(l)));
  }

  async loadLanguage(lang: string): Promise<void> {
    if (this.translations[lang]) return;
    const res = await fetch(`/i18n/${lang}.json`);
    this.translations[lang] = await res.json();
  }

  translate(key: string, placeholders?: Record<string, string>): string {
    const lang = this.settingsService.language();
    let result = this.resolve(key, lang) ?? this.resolve(key, this.fallBackLanguage) ?? key;
    if (placeholders) {
      Object.entries(placeholders).forEach(([k, v]) => {
        result = result.replaceAll(`{{${k}}}`, v);
      });
    }
    return result;
  }

  private resolve(key: string, lang: string): string | undefined {
    const value = key
      .split('.')
      .reduce<unknown>(
        (obj, part) =>
          obj != null && typeof obj === 'object'
            ? (obj as Record<string, unknown>)[part]
            : undefined,
        this.translations[lang],
      );
    return typeof value === 'string' ? value : undefined;
  }
}
