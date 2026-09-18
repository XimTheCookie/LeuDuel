import { Component, computed, inject, Inject, signal } from '@angular/core';
import { MODAL_COMPONENT_DATA } from '../../../services/modal.service';
import {
  MODAL_DATA,
  ModalGenericComponent,
} from '../../common/modal-generic/modal-generic.component';
import { DuelStore } from '../../../stores/duel-store/duel.store';

type Op = 'damage' | 'heal';

@Component({
  selector: 'app-life-points-adjust-modal',
  templateUrl: './life-points-adjust-modal.component.html',
  styleUrls: ['./life-points-adjust-modal.component.scss'],
  standalone: true,
  imports: [],
})
export class LifePointsAdjustModalComponent {
  duelStore = inject(DuelStore);

  player: 'player1' | 'player2';
  input = signal('0');
  op = signal<Op>('damage');
  private coolingDown = false;

  playerName = () => {
    return this.duelStore[this.player]()?.name ?? '';
  };

  currentLp = computed(() =>
    this.player === 'player1' ? this.duelStore.lifePoints1() : this.duelStore.lifePoints2(),
  );

  preview = computed(() => {
    const val = parseInt(this.input(), 10) || 0;
    const lp = this.currentLp();
    return this.op() === 'heal' ? Math.min(99999999, lp + val) : Math.max(0, lp - val);
  });

  constructor(
    @Inject(MODAL_DATA) private modalData: InstanceType<typeof ModalGenericComponent>['data'],
    @Inject(MODAL_COMPONENT_DATA) data: { player: 'player1' | 'player2' },
  ) {
    this.player = data.player;
  }

  private withCooldown(fn: () => void) {
    if (this.coolingDown) return;
    this.coolingDown = true;
    setTimeout(() => (this.coolingDown = false), 50);
    fn();
  }

  pressDigit(d: string) {
    this.withCooldown(() =>
      this.input.update((v) => {
        const next = v === '0' ? d : v + d;
        return next.length > 8 ? v : next;
      }),
    );
  }

  pressZeros(zeros: string) {
    this.withCooldown(() =>
      this.input.update((v) => {
        if (v === '0') return v;
        const next = v + zeros;
        return next.length > 8 ? v : next;
      }),
    );
  }

  clear() {
    this.withCooldown(() => this.input.set('0'));
  }

  setOp(op: Op) {
    this.withCooldown(() => this.op.set(op));
  }

  halfLp() {
    this.withCooldown(() => {
      this.op.set('damage');
      this.input.set(String(Math.round(this.currentLp() / 2)));
    });
  }

  apply() {
    const val = parseInt(this.input(), 10) || 0;
    if (val > 0) {
      this.duelStore.lifeAction(this.player, { change: val, type: this.op() });
    }
    this.close();
  }

  close() {
    this.modalData.overlayRef.dispose();
  }
}
