import { Component, Input } from '@angular/core';
import { SvgHouseBoxComponent } from '../svg-house-box/svg-house-box.component';
import { StoreService } from '../../services/store.service';
import type { IFloor } from '../../../types';

@Component({
  selector: '[data-item="floor"]',
  standalone: true,
  imports: [SvgHouseBoxComponent],
  templateUrl: './svg-house-floor.component.svg',
})
export class SvgHouseFloorComponent {
  @Input({ required: true }) public points: any[];
  @Input({ required: true }) public coords: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  @Input({ required: true }) public floor: IFloor;
  @Input({ required: true }) public pointsBoxes: any[];
  @Input({ required: true }) public floorNumber: string;
  @Input() public firstPorch: boolean = false;
  public visibleButtons: boolean = false;

  constructor(private store: StoreService) {}

  setApptFloor(floor: IFloor, e: Event) {
    const el = e.target as HTMLInputElement;
    const value = Number(el.value);
    const count = value > 0 ? value : 0;
    floor.setAppt(count);
    this.store.updateCoords();
  }

  movingTechFloor(dir: string, floor: any) {
    this.store.movingTechFloor(dir, floor);
  }

  get colors() {
    return this.store.colors;
  }

  get floorCoords() {
    return this.points.map((point) => point.join(',')).join(' ');
  }

  get pointsHiddenArea() {
    const points = [
      [this.coords.left + 2, this.coords.top + 2],
      [this.coords.right - 2, this.coords.top + 2],
      [this.coords.right - 2, this.coords.bottom],
      [this.coords.left + 2, this.coords.bottom],
    ];
    return points.map((point) => point.join(',')).join(' ');
  }

  get textCoords() {
    return {
      x: this.coords.left + 10,
      y: this.coords.top + 30,
    };
  }
}
