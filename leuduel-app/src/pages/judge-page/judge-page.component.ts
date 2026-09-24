import { Component, inject } from '@angular/core';
import { CardSearchComponent } from '../../components/common/card-search/card-search.component';
import { YgoCard } from '../../models/ygo-card.model';
import { CardSearchService } from '../../services/card-search.service';

@Component({
  selector: 'app-judge-page',
  templateUrl: './judge-page.component.html',
  styleUrls: ['./judge-page.component.scss'],
  standalone: true,
  imports: [CardSearchComponent],
})
export class JudgePageComponent {
  private readonly cardSearchService = inject(CardSearchService);

  openCard(card: YgoCard) {
    this.cardSearchService.openCardPage(card);
  }
}
