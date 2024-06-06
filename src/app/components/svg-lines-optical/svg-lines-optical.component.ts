import { Component } from '@angular/core';
import { StoreService } from '../../services/store.service';
import type {
  IBoxCoordsCalculate,
  IFloorCoordsCalculate,
  IPorchCoordsCalculate,
} from '../../../types';

@Component({
  selector: 'app-svg-lines-optical',
  standalone: true,
  imports: [],
  templateUrl: './svg-lines-optical.component.svg',
})
export class SvgLinesOpticalComponent {
  constructor(private store: StoreService) {}

  get lines() {
    const array = [];
    const left: number[] = [];
    const porchBoxes: any[][] = [];
    let top = 0;
    let top3 = 0;
    let top8 = 0;
    let origin: any = null;
    const getLine = (
      points: number[][],
      color = this.store.colors.between.value,
      dash: string | boolean = '10,5',
    ) => ({ points, color, dash });

    this.store.coords.porches.forEach((porch: IPorchCoordsCalculate, index) => {
      porchBoxes[index] = [];
      const floors = porch.floors.map((f: IFloorCoordsCalculate) => f);
      if (this.store.config.house.routingPosition === 'bottom') {
        floors.reverse();
        if (index === 0) {
          top = porch.coords.bottom - 10;
          top3 = top - 10;
          top8 = top3 - 10;
        }
      } else if (index === 0) {
        top = porch.coords.top + 10;
        top3 = top + 10;
        top8 = top3 + 10;
      }

      floors.forEach((floor) => {
        floor.boxes.forEach((box: IBoxCoordsCalculate) => {
          if (box.ess.type.includes('П')) return;
          if (box.ess.type === '3') left.push(porch.coords.right - 150);
          const newBox: any = {
            porch: index,
            type: box.ess.type,
            count: box.ess.receiverCount,
            origin: box.ess.origin,
            coords: {
              ...floor.coords,
              left: porch.coords.left,
              right: porch.coords.right,
            },
          };
          porchBoxes[index].push(newBox);
          if (newBox.origin) origin = newBox;
        });
      });
    });

    const resultLeft = origin ? origin.coords.right - 150 : Math.min(...left);
    const horizontal = getLine([
      [resultLeft, top],
      [this.store.coords.svg.width, top],
    ]);

    array.push(horizontal);

    porchBoxes.forEach((boxes) => {
      if (!boxes.length) return;
      const indexOrigin = boxes.findIndex((b) => b.origin);
      const searchBox = boxes[indexOrigin > -1 ? indexOrigin : 0];
      const points = [
        [searchBox.coords.right - 150, searchBox.coords.top + 20],
        [
          searchBox.coords.right - 150,
          searchBox.origin ? top : searchBox.type === '3' ? top3 : top8,
        ],
      ];
      if (!searchBox.origin) {
        const ind =
          searchBox.porch < origin.porch
            ? -10
            : searchBox.porch > origin.porch
              ? 10
              : 0;
        points.push([
          origin.coords.right - 150 + ind,
          searchBox.type === '3' ? top3 : top8,
        ]);
        if (searchBox.type === '8') {
          points.push([
            origin.coords.right - 150 + ind,
            origin.coords.top + 25,
          ]);
        }
      }
      if (searchBox.type === '8') {
        array.push(getLine(points, 'orange', false));
      } else {
        array.push(getLine(points));
      }

      boxes.forEach((box, indexBox) => {
        if (indexBox) {
          const boxOne = boxes[indexBox - 1];
          const boxTwo = boxes[indexBox];

          const pointsBetween = [
            [searchBox.coords.right - 120, boxOne.coords.top + 20],
            [searchBox.coords.right - 100, boxOne.coords.top + 20],
            [searchBox.coords.right - 100, boxTwo.coords.top + 20],
            [searchBox.coords.right - 120, boxTwo.coords.top + 20],
          ];

          if (boxOne.count && boxTwo.count) {
            array.push(getLine(pointsBetween));
          } else {
            array.push(getLine(pointsBetween, 'orange', false));
          }
        }
      });
    });

    return array;
  }
}
