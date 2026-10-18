import { Component, computed, inject, input, output } from '@angular/core';
import { ToolsStore } from '../../../stores/tools-store/tools.store';
import { CounterEvent } from '../../../models/counter-event.model';

@Component({
  selector: 'app-counter-tools',
  templateUrl: './counter-tools.component.html',
  styleUrls: ['./counter-tools.component.scss'],
  standalone: true,
})
export class CounterToolsComponent {
  toolsStore = inject(ToolsStore);
  counterEvent = output<CounterEvent>();

  player = input.required<1 | 2>();

  playerMz = computed(() =>
    this.player() === 1
      ? this.toolsStore.player1counters().mz
      : this.toolsStore.player2counters().mz,
  );

  playerStz = computed(() =>
    this.player() === 1
      ? this.toolsStore.player1counters().stz
      : this.toolsStore.player2counters().stz,
  );

  emz = computed(() => this.toolsStore.emz());

  playerFz = computed(() =>
    this.player() === 1 ? this.toolsStore.fz()[0] : this.toolsStore.fz()[1],
  );

  mzSet(i: number) {
    const event: CounterEvent = {
      index: i,
      player: this.player(),
      type: 'mz',
    };
    this.submitEvent(event);
  }
  stzSet(i: number) {
    const event: CounterEvent = {
      index: i,
      player: this.player(),
      type: 'stz',
    };
    this.submitEvent(event);
  }
  fzSet() {
    const event: CounterEvent = {
      index: this.player() - 1,
      player: this.player(),
      type: 'fz',
    };
    this.submitEvent(event);
  }

  private submitEvent(event: CounterEvent) {
    this.counterEvent.emit(event);
  }
}
