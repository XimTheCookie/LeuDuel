import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { SoundboardService } from '../../../services/soundboard/soundboard.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { BehaviourSettingsService } from '../../../services/settings/behaviour-settings.service';
import { ModalService } from '../../../services/modal/modal.service';
import { LifePointsResetComponent } from '../life-points-reset/life-points-reset.component';
import { DuelStore } from '../../../stores/duel-store/duel.store';

const ANIM_DURATION = 1500;

@Component({
  selector: 'app-life-points',
  templateUrl: './life-points.component.html',
  styleUrls: ['./life-points.component.scss'],
  standalone: true,
})
export class LifePointsComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly soundboardService = inject(SoundboardService);
  private readonly behaviourService = inject(BehaviourSettingsService);
  private readonly modalService = inject(ModalService);

  private readonly duelStore = inject(DuelStore);

  lifePoints = input<number>();
  compact = input(false);
  playerName = input<string>();
  displayValue = signal<number | undefined>(undefined);
  animating = signal(false);
  gaining = signal(false);

  private static zeroHandled = false;

  private animFrom = 0;
  private animTarget = 0;
  private animStart = 0;
  private rafId = 0;
  private changeAudio: HTMLAudioElement | null = null;
  private ready = false;

  constructor() {
    setTimeout(() => (this.ready = true), 250);

    effect(() => {
      const next = this.lifePoints();
      if (next === undefined || !this.ready) {
        untracked(() => this.displayValue.set(next));
        return;
      }

      const current = untracked(this.displayValue) ?? next;
      this.animFrom = current;
      this.animTarget = next;

      untracked(() => {
        this.gaining.set(next > current);
        if (!this.animating()) {
          this.startSoundLoop();
          this.animating.set(true);
        }
      });

      cancelAnimationFrame(this.rafId);
      this.animStart = performance.now();
      const duration = Math.abs(next - current) < 100 ? 500 : ANIM_DURATION;
      this.animate(duration);
    });

    effect(() => {
      if (!this.settingsService.soundsOn() && this.changeAudio) {
        this.stopSoundLoop();
      }
    });
  }

  private startSoundLoop() {
    if (!this.settingsService.soundsOn()) return;
    this.changeAudio = new Audio('audio/lp_change.wav');
    this.changeAudio.play();
  }

  private stopSoundLoop() {
    this.changeAudio?.pause();
    this.changeAudio = null;
    if ((this.displayValue() ?? this.lifePoints()) === 0) {
      this.soundboardService.lifePointsZero();
      this.onLpReachedZero();
    } else {
      this.soundboardService.lifePointsSet();
    }
  }

  private onLpReachedZero() {
    if (this.behaviourService.gameReset() === 0) return;
    if (this.duelStore.isDuelFinished()) return;
    if (LifePointsComponent.zeroHandled) return;
    LifePointsComponent.zeroHandled = true;
    const isAuto = this.behaviourService.gameReset() === 2;
    setTimeout(
      () => {
        LifePointsComponent.zeroHandled = false;
        // stop if lp value changed from 0
        if (this.displayValue() ?? this.lifePoints()) {
          return;
        }
        if (isAuto) {
          if (this.behaviourService.winnerSelect() === 1) {
            const getWinner = (): 'player1' | 'player2' | null => {
              const player1Lp = this.duelStore.lifePoints1();
              const player2Lp = this.duelStore.lifePoints2();
              if (player1Lp === player2Lp) return null;
              else if (player1Lp === 0) return 'player2';
              else if (player2Lp === 0) return 'player1';
              return null;
            };

            let selected = getWinner();

            if (selected !== null) {
              this.duelStore.addVictory(selected);
            }
          }

          // auto apply
          this.duelStore.lifeAction('player1', {
            type: 'set',
            change: this.settingsService.getStartingLifePoints(),
            lifeReset: true,
          });
          this.duelStore.lifeAction('player2', {
            type: 'set',
            change: this.settingsService.getStartingLifePoints(),
            lifeReset: true,
          });
        } else if (!this.modalService.hasOpenModal) {
          // auto-prompt
          this.modalService.open(LifePointsResetComponent, {
            size: 'sm',
            opacity: this.settingsService.getModalOpacity(),
          });
        }
      },
      isAuto ? 1500 : 750,
    );
  }

  private animate(duration: number) {
    this.rafId = requestAnimationFrame((now) => {
      const t = Math.min((now - this.animStart) / duration, 1);
      const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
      this.displayValue.set(Math.round(this.animFrom + (this.animTarget - this.animFrom) * eased));

      if (t < 1) {
        this.animate(duration);
      } else {
        this.stopSoundLoop();
        this.animating.set(false);
      }
    });
  }
}
