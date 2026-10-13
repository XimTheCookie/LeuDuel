import { Component, inject } from '@angular/core';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';
import { TranslatePipe } from '../../../pipes/translate/translate.pipe';

@Component({
  selector: 'app-snackbar',
  template: `
    @if (snackbarService.current(); as snackbar) {
      <div class="snackbar" [class]="snackbar.type">{{ snackbar.message | translate }}</div>
    }
  `,
  styles: `
    .snackbar {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 20px;
      border-radius: 8px;
      font-family: var(--font-ui);
      font-size: 14px;
      color: var(--text-primary);
      background: var(--bg-panel);
      border: 1px solid var(--border-subtle);
      box-shadow: 16px 16px 64px rgba(0, 0, 0, 0.75);
      z-index: 9999;
      animation: snackbar-in 0.25s ease;
      width: 64%;
      max-width: 16rem;

      &.error {
        border-color: var(--btn-negative-border);
        color: var(--color-negative-bright);
      }

      &.warning {
        border-color: var(--btn-warning-border);
        color: var(--btn-warning-accent);
      }

      &.success {
        border-color: var(--btn-positive-border);
        color: var(--color-positive);
      }

      &.neutral {
        border-color: var(--btn-neutral-border);
        color: var(--text-primary);
      }
    }

    @keyframes snackbar-in {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `,
  imports: [TranslatePipe],
})
export class SnackbarComponent {
  snackbarService = inject(SnackbarService);
}
