import { Component, computed, inject, viewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonComponent } from '../../components/common/button/button.component';
import { ListPickerComponent } from '../../components/common/list-picker/list-picker.component';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { ConditionCardNameModalComponent } from '../../components/core/condition-card-name-modal/condition-card-name-modal.component';
import { DuelConditionService } from '../../services/duel-condition/duel-condition.service';
import { ModalService } from '../../services/modal/modal.service';
import { DuelStore } from '../../stores/duel-store/duel.store';
import { TranslatePipe } from '../../pipes/translate/translate.pipe';
import { IconComponent } from '../../components/common/icon/icon.component';

@Component({
  selector: 'app-condition-page',
  templateUrl: './condition-page.component.html',
  styleUrls: ['./condition-page.component.scss'],
  standalone: true,
  imports: [ButtonComponent, ListPickerComponent, TranslatePipe, IconComponent],
})
export class ConditionPageComponent {
  private readonly modalData = inject(MODAL_DATA);
  private readonly modalService = inject(ModalService);
  readonly duelStore = inject(DuelStore);
  readonly conditionService = inject(DuelConditionService);

  readonly player = computed<'player1' | 'player2'>(
    () => this.modalData.config.custom?.player ?? 'player1',
  );

  playerName = computed(() => {
    const player = this.duelStore[this.player()]();
    return player.profile?.displayName ?? player.name;
  });

  readonly conditions = computed(() =>
    this.duelStore.conditions().filter((c) => c.targets === this.player() || c.targets === 'both'),
  );

  readonly cardOptions = computed(() => {
    const availableCards = this.conditionService
      .getAllConditionCards()
      .map((x) => ({ label: x.card.name, value: x.id }));

    const selectedConditions = this.conditions().filter((c) => c.cardName === '');

    return availableCards.filter((c) => !selectedConditions.some((sc) => sc.id === c.value));
  });

  cardControl = new FormControl<number | null>(null);

  readonly conditionList = viewChild<ElementRef<HTMLElement>>('conditionList');

  get selectedCard() {
    const id = this.cardControl.value;
    return id != null ? this.conditionService.getConditionCard(id) : null;
  }

  confirmAdd() {
    const id = this.cardControl.value;
    if (id == null) return;
    const card = this.conditionService.getConditionCard(id);

    if (card?.cardRequired) {
      this.modalService.open(
        ConditionCardNameModalComponent,
        {
          size: 'sm',
          mirror: this.modalData.config.mirror,
          closeEvent: () => this.cleanupPicker(),
        },
        {
          onConfirm: (cardName: string) => {
            this.addCondition(id, cardName);
          },
        },
      );
    } else {
      this.addCondition(id);
    }
  }

  private addCondition(id: number, cardName?: string) {
    this.duelStore.addCardCondition(id, this.player(), cardName);
    this.cleanupPicker();
    setTimeout(() =>
      this.conditionList()?.nativeElement.scrollTo({
        top: this.conditionList()!.nativeElement.scrollHeight,
        behavior: 'smooth',
      }),
    );
  }

  remove(id: number, cardName: string) {
    this.duelStore.removeCardCondition(id, cardName || undefined);
  }

  cleanupPicker() {
    this.cardControl.reset();
  }
}
