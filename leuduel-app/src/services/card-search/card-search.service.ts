import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { API_CONFIG } from '../../app/api.config';
import { take } from 'rxjs';
import { YgoCard } from '../../models/ygo-card.model';
import { SoundboardService } from '../soundboard/soundboard.service';

export interface CardSearchParams {
  name?: string;
  atk?: string;
  def?: string;
  attribute?: string;
  race?: string;
  type?: string;
  level?: string;
  scale?: string;
  archetype?: string;
}

@Injectable({ providedIn: 'root' })
export class CardSearchService {
  private readonly soundboardService = inject(SoundboardService);
  private readonly httpClient = inject(HttpClient);

  results = signal<YgoCard[]>([]);
  loading = signal(false);
  error = signal('');

  enterPage() {
    this.error.set('');
  }

  searchCards(params: CardSearchParams) {
    this.loading.set(true);
    this.error.set('');
    this.results.set([]);

    let httpParams = new HttpParams();
    if (params.name) httpParams = httpParams.set('fname', params.name);
    if (params.atk) httpParams = httpParams.set('atk', params.atk);
    if (params.def) httpParams = httpParams.set('def', params.def);
    if (params.attribute) httpParams = httpParams.set('attribute', params.attribute);
    if (params.race) httpParams = httpParams.set('race', params.race);
    if (params.type) httpParams = httpParams.set('type', params.type);
    if (params.level) httpParams = httpParams.set('level', params.level);
    if (params.scale) httpParams = httpParams.set('scale', params.scale);
    if (params.archetype) httpParams = httpParams.set('archetype', params.archetype);
    httpParams = httpParams.set('misc', 'yes');
    return this.httpClient
      .get<{ data: YgoCard[] }>(API_CONFIG.YGOPRODECK, { params: httpParams })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.results.set(res.data ?? []);
          this.loading.set(false);
          this.soundboardService.confirmationSound();
        },
        error: (err) => {
          this.error.set(err?.error?.error ?? 'No cards found.');
          this.loading.set(false);
          this.soundboardService.clickSound();
        },
      });
  }

  openCardPage(card: YgoCard) {
    const konamiId = card.misc_info?.[0]?.konami_id;
    if (!konamiId) return;
    const url = API_CONFIG.YGODB.replace('%cardId%', String(konamiId));
    if (Capacitor.isNativePlatform()) {
      Browser.open({ url });
    } else {
      window.open(url, '_blank', 'noopener');
    }
  }

  parseQuery(raw: string): CardSearchParams {
    const parts = raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    const params: CardSearchParams = {};
    const filters: string[] = [];

    for (const part of parts) {
      const match = part.match(/^(atk|def|attr|attribute|race|type|level|scale|archetype)=(.+)$/i);
      if (match) {
        const key = match[1].toLowerCase();
        const val = match[2].trim();
        if (key === 'attr') params.attribute = val;
        else (params as Record<string, string>)[key] = val;
      } else {
        filters.push(part);
      }
    }

    if (filters.length) params.name = filters.join(' ');
    return params;
  }
}
