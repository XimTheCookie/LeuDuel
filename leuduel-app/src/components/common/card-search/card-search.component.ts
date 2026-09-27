import { Component, inject, OnInit, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextButtonComponent } from '../text-button/text-button.component';
import { CardSearchService } from '../../../services/card-search/card-search.service';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { YgoCard } from '../../../models/ygo-card.model';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

@Component({
  selector: 'app-card-search',
  templateUrl: './card-search.component.html',
  styleUrls: ['./card-search.component.scss'],
  standalone: true,
  imports: [FormsModule, TextButtonComponent, TranslatePipe],
})
export class CardSearchComponent implements OnInit {
  private readonly cardSearchService = inject(CardSearchService);
  private readonly soundboardService = inject(SoundboardService);

  cardSelected = output<YgoCard>();

  query = signal('');
  results = computed(() => this.cardSearchService.results());
  loading = computed(() => this.cardSearchService.loading());
  error = computed(() => this.cardSearchService.error());

  onQueryChange(value: string) {
    this.query.set(value);
  }

  search() {
    const raw = this.query().trim();
    if (!raw || this.loading()) return;
    this.soundboardService.clickSound();
    this.cardSearchService.searchCards(this.cardSearchService.parseQuery(raw));
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.search();
  }

  selectCard(card: YgoCard) {
    this.cardSelected.emit(card);
  }

  ngOnInit() {
    this.cardSearchService.enterPage();
  }
}
