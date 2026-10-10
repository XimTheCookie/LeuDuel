import { AfterViewInit, Component, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { MODAL_DATA } from '../../components/common/modal-generic/modal-generic.component';
import { SettingsService } from '../../services/settings/settings.service';
import { RandomService } from '../../services/random/random.service';
import { PlayerRandomizerPanelComponent } from '../../components/core/player-randomizer-panel/player-randomizer-panel.component';

@Component({
  selector: 'app-player-randomizer-page',
  templateUrl: './player-randomizer-page.component.html',
  styleUrls: ['./player-randomizer-page.component.scss'],
  standalone: true,
  imports: [PlayerRandomizerPanelComponent],
})
export class PlayerRandomizerPageComponent implements AfterViewInit, OnDestroy {
  private readonly modalData = inject(MODAL_DATA);
  readonly settingsService = inject(SettingsService);
  private readonly randomService = inject(RandomService);

  private timeout: ReturnType<typeof setTimeout> | null = null;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;
  private closed = false;

  player1Randomizer = viewChild<PlayerRandomizerPanelComponent>('player1Randomizer');
  player2Randomizer = viewChild<PlayerRandomizerPanelComponent>('player2Randomizer');

  close() {
    if (this.closed) return;
    this.closed = true;
    this.stop();
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.closeTimeout = null;
    this.modalData.config.closeEvent?.();
    this.modalData.overlayRef.dispose();
  }

  ngOnDestroy(): void {
    this.stop();
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.closeTimeout = null;
  }

  private stop(): void {
    this.stopped = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = null;
  }

  ngAfterViewInit(): void {
    this.randomize();
  }

  onCompleted() {
    if (this.stopped) return;
    this.stop();
    this.closeTimeout = setTimeout(() => this.close(), 8000);
  }

  randomize() {
    if (this.stopped) return;
    const player: 1 | 2 = this.randomService.coinFlip() === 'heads' ? 1 : 2;
    const event: 'add' | 'remove' = this.randomService.randomInt(1, 100) <= 75 ? 'add' : 'remove';

    this.triggerEvent(player, event);

    this.timeout = setTimeout(() => this.randomize(), 10);
  }

  triggerEvent(player: 1 | 2, type: 'add' | 'remove') {
    if (player === 1) {
      this.player1Randomizer()?.triggerEvent(type);
    } else {
      this.player2Randomizer()?.triggerEvent(type);
    }
  }
}
