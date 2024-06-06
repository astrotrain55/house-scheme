import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input({ required: true }) public show: boolean;
  @Input() public header: boolean;
  @Input() public title: string;
  @Output() public close: EventEmitter<number> = new EventEmitter<number>();

  onClose() {
    this.close.emit();
  }
}
