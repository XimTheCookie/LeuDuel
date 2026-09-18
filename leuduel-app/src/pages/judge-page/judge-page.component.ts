import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardSearchService, YgoCard } from '../../services/card-search.service';
import { TextButtonComponent } from '../../components/common/text-button/text-button.component';

@Component({
  selector: 'app-judge-page',
  templateUrl: './judge-page.component.html',
  styleUrls: ['./judge-page.component.scss'],
  standalone: true,
  imports: [FormsModule, TextButtonComponent],
})
export class JudgePageComponent {
  private readonly cardSearchService = inject(CardSearchService);

  openCard(card: YgoCard) {
    this.cardSearchService.openCardPage(card);
  }

  query = signal('');
  results = signal<YgoCard[]>([]);
  loading = signal(false);
  error = signal('');
  coolingDown = signal(false);

  onQueryChange(value: string) {
    this.query.set(value);
  }

  search() {
    const raw = this.query().trim();
    if (!raw || this.coolingDown()) return;

    this.coolingDown.set(true);
    setTimeout(() => this.coolingDown.set(false), 500);

    this.loading.set(true);
    this.error.set('');
    this.results.set([]);

    const params = this.cardSearchService.parseQuery(raw);
    this.cardSearchService.searchCards(params).subscribe({
      next: (res) => {
        this.results.set(res.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'No cards found.');
        this.loading.set(false);
      },
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.search();
  }
}
