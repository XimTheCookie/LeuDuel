import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextButtonComponent } from '../../components/common/text-button/text-button.component';
import { YgoCard } from '../../models/ygo-card.model';
import { CardSearchService } from '../../services/card-search.service';
import { SoundboardService } from '../../services/soundboard.service';

@Component({
  selector: 'app-judge-page',
  templateUrl: './judge-page.component.html',
  styleUrls: ['./judge-page.component.scss'],
  standalone: true,
  imports: [FormsModule, TextButtonComponent],
})
export class JudgePageComponent implements OnInit {
  private readonly soundboardService = inject(SoundboardService);
  private readonly cardSearchService = inject(CardSearchService);

  openCard(card: YgoCard) {
    this.cardSearchService.openCardPage(card);
  }

  query = signal('');
  results = computed(() => this.cardSearchService.results());
  loading = computed(() => this.cardSearchService.loading());
  error = computed(() => this.cardSearchService.error());
  coolingDown = signal(false);

  onQueryChange(value: string) {
    this.query.set(value);
  }

  search() {
    const raw = this.query().trim();
    if (!raw || this.coolingDown()) return;
    this.soundboardService.clickSound();

    this.coolingDown.set(true);
    setTimeout(() => this.coolingDown.set(false), 500);

    const params = this.cardSearchService.parseQuery(raw);
    this.cardSearchService.searchCards(params);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.search();
  }

  ngOnInit(): void {
    this.cardSearchService.enterPage();
  }
}
