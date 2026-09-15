import { Component, signal } from '@angular/core';
import { DuelPageComponent } from '../pages/duel-page/duel-page.component';

@Component({
  imports: [DuelPageComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('leuduel-app');
}
