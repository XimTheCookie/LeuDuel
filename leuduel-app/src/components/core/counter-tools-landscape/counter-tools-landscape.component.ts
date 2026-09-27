import { Component, computed, inject, input } from '@angular/core';
import { ToolsStore } from '../../../stores/tools-store/tools.store';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';

@Component({
  selector: 'app-counter-tools-landscape',
  templateUrl: './counter-tools-landscape.component.html',
  styleUrls: ['./counter-tools-landscape.component.scss'],
  standalone: true,
})
export class CounterToolsLandscapeComponent {
  private soundboardService = inject(SoundboardService);
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

  playerMzReversed = computed(() => [...this.playerMz()].reverse());
  playerStzReversed = computed(() => [...this.playerStz()].reverse());

  reversedMzIndex(reversedI: number) {
    return this.playerMz().length - 1 - reversedI;
  }

  reversedStzIndex(reversedI: number) {
    return this.playerStz().length - 1 - reversedI;
  }

  playerFz = computed(() =>
    this.player() === 1 ? this.toolsStore.fz()[0] : this.toolsStore.fz()[1],
  );

  mzAdd(i: number) {
    this.soundboardService.counterSound();
    this.toolsStore.addCounter(this.player(), 'mz', i);
  }
  mzRemove(i: number) {
    this.soundboardService.clickSound();
    this.toolsStore.removeCounter(this.player(), 'mz', i);
  }
  stzAdd(i: number) {
    this.soundboardService.counterSound();
    this.toolsStore.addCounter(this.player(), 'stz', i);
  }
  stzRemove(i: number) {
    this.soundboardService.clickSound();
    this.toolsStore.removeCounter(this.player(), 'stz', i);
  }
  fzAdd() {
    this.soundboardService.counterSound();
    this.toolsStore.addFz(this.player() === 1 ? 0 : 1);
  }
  fzRemove() {
    this.soundboardService.clickSound();
    this.toolsStore.removeFz(this.player() === 1 ? 0 : 1);
  }
}
