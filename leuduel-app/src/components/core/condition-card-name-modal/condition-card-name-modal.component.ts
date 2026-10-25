import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MODAL_COMPONENT_DATA } from '../../../services/modal/modal.service';
import { MODAL_DATA } from '../../common/modal-generic/modal-generic.component';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

@Component({
  selector: 'app-condition-card-name-modal',
  templateUrl: './condition-card-name-modal.component.html',
  styleUrls: ['./condition-card-name-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, TextButtonComponent, TranslatePipe],
})
export class ConditionCardNameModalComponent {
  private readonly modalData = inject(MODAL_DATA);
  readonly data = inject<{ onConfirm: (name: string) => void }>(MODAL_COMPONENT_DATA);
  cardName = signal('');

  confirm() {
    const name = this.cardName().trim();
    if (!name) return;
    this.data.onConfirm(name);
    this.modalData.overlayRef.dispose();
  }

  close() {
    this.modalData.overlayRef.dispose();
  }
}
