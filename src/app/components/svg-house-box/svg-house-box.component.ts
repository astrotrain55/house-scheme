import { Component, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';
import type { IBox } from '../../../types';

@Component({
  selector: '[data-item="box"]',
  standalone: true,
  imports: [],
  templateUrl: './svg-house-box.component.svg',
})
export class SvgHouseBoxComponent {
  @Input({ required: true }) public box: IBox;
  @Input({ required: true }) public color: string;
  @Input({ required: true }) public points: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  public visibleButtons: boolean = false;

  constructor(private store: StoreService) {}

  get isReceiver() {
    return this.box.type === '3';
  }

  get isVisible() {
    return !this.box.type.includes('П');
  }

  movingBox(dir: string, id: string) {
    this.store.movingBox(dir, id);
  }

  setReceiverCount(box: IBox, e: Event) {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    const value = Number(el.value);
    const count = value > 0 ? value : 0;
    box.setReceiverCount(count);
    this.store.updateCoords();
  }
}
