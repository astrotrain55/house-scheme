import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit {
  @Input({ required: true }) public names: string[];
  @Input() public defaultValue: number = 0;
  @Output() public update: EventEmitter<number> = new EventEmitter<number>();
  public index: number = 0;

  ngOnInit(): void {
    this.index = this.defaultValue;
  }

  onChange(index: number) {
    this.index = index;
    this.update.emit(index);
  }
}
