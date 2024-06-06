import { Component } from '@angular/core';
import { StoreService } from '../../services/store.service';
import type { IBoxCoords, IPorchCoordsCalculate } from '../../../types';

@Component({
  selector: '[data-item="internet"][data-name="Интернет"]',
  standalone: true,
  imports: [],
  templateUrl: './svg-lines-net.component.svg',
})
export class SvgLinesNetComponent {
  constructor(private store: StoreService) {}

  get lines() {
    const porchBoxes: IBoxCoords[][] = [];
    this.store.coords.porches.forEach((porch: IPorchCoordsCalculate, index) => {
      porchBoxes[index] = [];
      const floors = porch.floors.map((f) => f);

      floors.forEach((floor) => {
        floor.boxes.forEach((box) => {
          if (box.ess.floors && box.ess.floors.length)
            console.log(box.ess.floors);
        });
      });
    });
    return porchBoxes;
  }
}
