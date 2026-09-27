import { Component, inject } from '@angular/core';
import { CardSearchComponent } from '../../components/common/card-search/card-search.component';
import { YgoCard } from '../../models/ygo-card.model';
import { CardSearchService } from '../../services/card-search/card-search.service';
import { InfoModalComponent } from '../../components/common/info-modal/info-modal.component';
import { SoundboardService } from '../../services/soundboard/soundboard.service';
import { SettingsService } from '../../services/settings/settings.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-judge-page',
  templateUrl: './judge-page.component.html',
  styleUrls: ['./judge-page.component.scss'],
  standalone: true,
  imports: [CardSearchComponent],
})
export class JudgePageComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly modalService = inject(ModalService);
  private readonly settingsService = inject(SettingsService);
  private readonly cardSearchService = inject(CardSearchService);

  openCard(card: YgoCard) {
    this.cardSearchService.openCardPage(card);
  }

  openInfo() {
    this.soundboardService.clickSound();
    this.modalService.open(
      InfoModalComponent,
      {
        size: 'sm',
        opacity: this.settingsService.getModalOpacity(),
      },
      {
        info: `
        All search options:
<ul>
  <li><b>atk</b>: Monster Card attack.</li>
  <li><b>def</b>: Monster Card defense.</li>
  <li><b>attribute</b>: Monster Card attribute.</li>
  <li><b>race</b>: Monster Card type (Dragon, Spellcaster, etc).</li>
  <li><b>type</b>: Monster Card type (Normal Monster, Synchro Monster, Fusion Monster, Union Effect Monster, Flip Monster).</li>
  <li><b>level</b>: Monster Card level.</li>
  <li><b>scale</b>: Pendulum Monster Card scale.</li>
  <li><b>archetype</b>: Archetype.</li>
</ul>
        `,
      },
    );
  }
}
