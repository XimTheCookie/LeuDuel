import { Component, input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-setting',
  templateUrl: './select-setting.component.html',
  styleUrls: ['./select-setting.component.scss'],
  standalone: true,
  imports: [],
})
export class SelectSettingComponent implements OnInit {
  control = input.required<FormControl<number>>();
  labels = input.required<string[]>();
  label = input<string>('');
  defaultValue = input<number>(0);

  private initialValue!: number;

  ngOnInit() {
    this.initialValue = this.control().value;
  }

  select(index: number) {
    this.control().setValue(index);
  }

  reset() {
    this.control().setValue(this.defaultValue());
  }
}
