import { Component, computed, inject, input } from '@angular/core';
import { ToolsStore } from '../../../stores/tools-store/tools.store';
import { SoundboardService } from '../../../services/soundboard.service';

const COOLDOWN_MS = 50;

@Component({
  selector: 'app-counter-tools',
  templateUrl: './counter-tools.component.html',
  styleUrls: ['./counter-tools.component.scss'],
  standalone: true,
})
export class CounterToolsComponent {
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

  emz = computed(() => this.toolsStore.emz());

  playerFz = computed(() =>
    this.player() === 1 ? this.toolsStore.fz()[0] : this.toolsStore.fz()[1],
  );

  private lastAction = 0;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;

  private canAct(): boolean {
    const now = Date.now();
    if (now - this.lastAction < COOLDOWN_MS) return false;
    this.lastAction = now;
    return true;
  }

  onPress(): void {
    this.longPressTimer = setTimeout(() => {
      this.longPressTimer = null;
    }, 500);
  }

  onRelease(addAction: () => void, removeAction: () => void, event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    if (event instanceof MouseEvent && event.button === 2) return;
    if (!this.canAct()) return;
    if (this.longPressTimer !== null) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
      addAction();
    } else {
      removeAction();
    }
  }

  onContextMenu(removeAction: () => void, event: MouseEvent): void {
    event.preventDefault();
    if (!this.canAct()) return;
    if (this.longPressTimer !== null) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    removeAction();
  }

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
  emzAdd(i: 0 | 1) {
    this.soundboardService.counterSound();
    this.toolsStore.addEmz(i);
  }
  emzRemove(i: 0 | 1) {
    this.soundboardService.clickSound();
    this.toolsStore.removeEmz(i);
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
