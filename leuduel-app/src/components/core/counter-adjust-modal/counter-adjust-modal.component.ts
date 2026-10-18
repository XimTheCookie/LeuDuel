import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CounterEvent } from '../../../models/counter-event.model';
import { SettingsService } from '../../../services/settings/settings.service';
import { ToolsStore } from '../../../stores/tools-store/tools.store';
import { ButtonComponent } from '../../common/button/button.component';
import { MODAL_DATA } from '../../common/modal-generic/modal-generic.component';
import { NumberInputComponent } from '../../common/number-input/number-input.component';
import { TextButtonComponent } from '../../common/text-button/text-button.component';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-counter-adjust-modal',
  templateUrl: './counter-adjust-modal.component.html',
  styleUrls: ['./counter-adjust-modal.component.scss'],
  standalone: true,
  imports: [NumberInputComponent, ButtonComponent, TextButtonComponent],
})
export class CounterAdjustModalComponent implements AfterViewInit {
  private readonly toolsStore = inject(ToolsStore);
  private readonly modalData = inject(MODAL_DATA);
  readonly settingsService = inject(SettingsService);
  private readonly soundboardService = inject(SoundboardService);
  counterValue = new FormControl<number>(0, [Validators.min(0), Validators.max(99)]);
  resetDisabled = signal(true);

  event = computed<CounterEvent | null>(() => this.modalData.config.custom?.event ?? null);

  label = computed(() => `counter-page.adjust.${this.event()?.type ?? 'fb'}`);

  constructor() {
    this.counterValue.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.resetDisabled.set((v ?? 0) === 0));
  }

  ngAfterViewInit(): void {
    const event = this.event();
    if (!event) return;
    this.counterValue.setValue(this.toolsStore.getCounter(event));
  }

  onIncrement() {
    this.soundboardService.counterAdd();
  }

  onDecrement() {
    this.soundboardService.counterRemove();
  }

  resetValue() {
    this.soundboardService.clickSound();
    this.counterValue.setValue(0);
  }

  submitValue() {
    const event = this.event();
    if (!event) return;
    this.soundboardService.confirmationSound();
    let value = this.counterValue.value ?? 0;
    if (value > 99) value = 99;
    if (value < 0) value = 0;
    this.toolsStore.setCounter({ ...event, value });
    this.close();
  }

  close() {
    this.soundboardService.clickSound();
    this.modalData.overlayRef.dispose();
  }
}
