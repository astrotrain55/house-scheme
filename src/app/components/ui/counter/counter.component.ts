import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
})
export class CounterComponent {
  @Input({ required: true }) defaultNumber: number;
  @Input() public min: number = 0;
  @Input() public max: number = Infinity;
  @Output() public update: EventEmitter<number> = new EventEmitter<number>();

  onChange(e: Event) {
    const el = e.target as HTMLInputElement;
    this.onInput(Number(el.value));
  }

  onInput(value: number) {
    const count =
      value < this.min ? this.min : value > this.max ? this.max : value;
    this.update.emit(count);
  }
}
