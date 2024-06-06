import { Component, Input } from '@angular/core';
import { SvgHouseFloorComponent } from '../svg-house-floor/svg-house-floor.component';
import { SvgLinesKtvComponent } from '../svg-lines-ktv/svg-lines-ktv.component';
import type { IPorch } from '../../../types';

@Component({
  selector: '[data-item="porch"]',
  standalone: true,
  imports: [SvgHouseFloorComponent, SvgLinesKtvComponent],
  templateUrl: './svg-house-porch.component.svg',
})
export class SvgHousePorchComponent {
  @Input({ required: true }) public porchId: string;
  @Input({ required: true }) public porchNumber: string;
  @Input({ required: true }) public porch: IPorch;
  @Input({ required: true }) public points: any[];
  @Input({ required: true }) public coords: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  @Input({ required: true }) public pointsFloors: any[];
  @Input({ required: true }) public floors: any[];
  @Input() public first: boolean = false;

  get porchCoords() {
    return this.points.map((point) => point.join(',')).join(' ');
  }
}
