import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TimerService } from '../../../services/timer/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  standalone: true,
  imports: [DatePipe],
})
export class TimerComponent {
  timerService = inject(TimerService);
}
