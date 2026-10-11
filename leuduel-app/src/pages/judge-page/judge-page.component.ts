import { Component, inject } from '@angular/core';
import { CardSearchComponent } from '../../components/common/card-search/card-search.component';
import { InfoModalComponent } from '../../components/common/info-modal/info-modal.component';
import { YgoCard } from '../../models/ygo-card.model';
import { TranslatePipe } from '../../pipes/translate/translate.pipe';
import { CardSearchService } from '../../services/card-search/card-search.service';
import { ModalService } from '../../services/modal/modal.service';
import { SoundboardService } from '../../services/soundboard/soundboard.service';
import { TranslateService } from '../../services/translate/translate.service';

@Component({
  selector: 'app-judge-page',
  templateUrl: './judge-page.component.html',
  styleUrls: ['./judge-page.component.scss'],
  standalone: true,
  imports: [CardSearchComponent, TranslatePipe],
})
export class JudgePageComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly modalService = inject(ModalService);
  private readonly cardSearchService = inject(CardSearchService);
  private readonly translateService = inject(TranslateService);

  openCard(card: YgoCard) {
    this.cardSearchService.openCardPage(card);
  }

  openInfo() {
    this.soundboardService.clickSound();
    this.modalService.open(
      InfoModalComponent,
      {
        size: 'sm',
      },
      {
        info: this.translateService.translate('judge-page.info'),
      },
    );
  }
}
