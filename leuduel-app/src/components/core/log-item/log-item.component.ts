import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LifeChange } from '../../../models/life-change.model';
import { IconComponent } from '../../common/icon/icon.component';

@Component({
  selector: 'app-log-item',
  standalone: true,
  templateUrl: './log-item.component.html',
  styleUrls: ['./log-item.component.scss'],
  imports: [DatePipe, IconComponent],
})
export class LogItemComponent {
  lifeLog = input.required<LifeChange>();
  undoable = input<boolean>(true);
  undo = output<number>();
}
