import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  @Input({ required: true }) public names: string[];
  @Input() public defaultValue: number = 0;
  @Output() public update: EventEmitter<number> = new EventEmitter<number>();

  onChange(index: number) {
    this.update.emit(index);
  }
}
