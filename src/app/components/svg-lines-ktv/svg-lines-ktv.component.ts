import { Component, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';
import type { IFloorCoords, IPorch } from '../../../types';

@Component({
  selector: '[data-item="ktv"]',
  standalone: true,
  imports: [],
  templateUrl: './svg-lines-ktv.component.svg',
})
export class SvgLinesKtvComponent {
  @Input({ required: true }) public coords: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  @Input({ required: true }) public pointsFloors: any[];
  @Input({ required: true }) public porch: IPorch;

  constructor(private store: StoreService) {}

  get color() {
    return this.store.colors.ktv.value;
  }

  get ktvList() {
    const width: number[] = [-35, -80, -240].reverse();
    const indexes = this.porch.risers.list.reduce((acc: number[], item, i) => {
      if (item.ktv) acc.push(width[i]);
      return acc;
    }, []);
    const findFn = (point: IFloorCoords) =>
      point.ess.type === 'default' && !point.ess.entity;
    const startFloor = this.pointsFloors.map((p) => p).find(findFn);
    const endFloor = this.pointsFloors
      .map((p) => p)
      .reverse()
      .find(findFn);
    const { top } = startFloor.coords;
    const { bottom } = endFloor.coords;
    const porchRight = this.coords.right;
    const coords = indexes.map((left) =>
      [left, left + 6, left + 12, left + 18].map((offset) => [
        [porchRight + offset, top],
        [porchRight + offset, bottom],
      ]),
    );

    const rectangles = this.pointsFloors.filter(findFn).map((floor) =>
      indexes.map((left) => {
        const tempCoords = [left, left + 6, left + 12, left + 18];
        return tempCoords.map((offset, index) => ({
          x: porchRight + offset - 3,
          y: index % 2 === 0 ? floor.coords.top + 15 : floor.coords.top + 30,
          size: 6,
        }));
      }),
    );

    return {
      polyline: coords.flat(),
      rect: rectangles.flat(2),
    };
  }
}
