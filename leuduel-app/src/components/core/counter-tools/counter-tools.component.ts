import { Component, computed, inject, input } from '@angular/core';
import { ToolsStore } from '../../../stores/tools-store/tools.store';

@Component({
  selector: 'app-counter-tools',
  templateUrl: './counter-tools.component.html',
  styleUrls: ['./counter-tools.component.scss'],
  standalone: true,
})
export class CounterToolsComponent {
  toolsStore = inject(ToolsStore);

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

  mzAdd(i: number) {
    this.toolsStore.addCounter(this.player(), 'mz', i);
  }
  mzRemove(i: number) {
    this.toolsStore.removeCounter(this.player(), 'mz', i);
  }
  stzAdd(i: number) {
    this.toolsStore.addCounter(this.player(), 'stz', i);
  }
  stzRemove(i: number) {
    this.toolsStore.removeCounter(this.player(), 'stz', i);
  }
  emzAdd(i: 0 | 1) {
    this.toolsStore.addEmz(i);
  }
  emzRemove(i: 0 | 1) {
    this.toolsStore.removeEmz(i);
  }
  fzAdd() {
    this.toolsStore.addFz(this.player() === 1 ? 0 : 1);
  }
  fzRemove() {
    this.toolsStore.removeFz(this.player() === 1 ? 0 : 1);
  }
}
