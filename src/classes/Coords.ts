import config from '../tools/config';
import type {
  IBoxCoords,
  IBoxCoordsCalculate,
  IFloor,
  IFloorCoords,
  IFloorCoordsCalculate,
  IPorch,
  IPorchCoords,
  IPorchCoordsCalculate,
} from '../types';

export interface ICalculateCoords {
  svg: {
    width: number;
    height: number;
    viewBox: number[];
  };
  porches: IPorchCoordsCalculate[];
}

export default class Coords {
  public x: number = -2;
  public y: number = -2;
  public floorsSizes: { width: number; height: number }[] = [];
  public porches: IPorchCoords[];

  constructor(porches: IPorch[], visibleAll: boolean) {
    this.porches = this.parsePorches(porches, visibleAll);
  }

  parsePorches(porches: IPorch[], visibleAll: boolean): IPorchCoords[] {
    const visibleFilter = (ess: IPorch | IFloor) => visibleAll || ess.visible;

    return porches.filter(visibleFilter).map((porch) => ({
      ess: porch,
      sizes: porch.sizes,
      offset: porch.offset,
      isTower: porch.isTower,
      floors: porch.floors.filter(visibleFilter).map((floor) => ({
        ess: floor,
        sizes: floor.sizes,
        tower: floor.tower,
        boxes: floor.boxes.map((box) => ({
          ess: box,
          sizes: box.sizes,
        })),
      })),
    }));
  }

  calculate(): ICalculateCoords {
    this.floorsSizes = this.calculateFloorsSizes();

    return {
      svg: this.calculateSvg(),
      porches: this.calculatePorches(),
    };
  }

  offset(fullWidth: number, width: number) {
    return (fullWidth - width) / 2;
  }

  calculateFloorsSizes() {
    const floorsSizes: { width: number; height: number }[] = [];

    this.porches.forEach((porch) => {
      porch.floors.forEach((floor: IFloorCoords, index: number) => {
        if (!floorsSizes[index]) {
          floorsSizes[index] = {
            width: floor.sizes.width,
            height: floor.sizes.height,
          };
        }
        if (floorsSizes[index].width < floor.sizes.width) {
          floorsSizes[index].width = floor.sizes.width;
        }
        if (floorsSizes[index].height < floor.sizes.height) {
          floorsSizes[index].height = floor.sizes.height;
        }
      });
    });

    return floorsSizes;
  }

  calculateBoxes(
    floorBoxes: IBoxCoords[],
    floorCoords: { top: number; right: number; bottom: number; left: number },
    isTower: boolean,
  ): IBoxCoordsCalculate[] {
    const floorOffset = 5;
    const boxes: IBoxCoordsCalculate[] = [];

    floorBoxes.forEach((box, index) => {
      const top =
        (index + 1) * floorOffset + index * box.sizes.height + floorCoords.top;
      const offset = this.offset(config.sizes.porch.width, box.sizes.width);
      const left = isTower
        ? floorCoords.left + floorOffset
        : floorCoords.right - box.sizes.width - offset;
      const right = left + box.sizes.width;
      const coords = {
        top,
        right,
        bottom: top + box.sizes.height,
        left,
      };
      const points = {
        x: left,
        y: top,
        width: box.sizes.width,
        height: box.sizes.height,
      };

      boxes[index] = {
        ess: box.ess,
        coords,
        points,
      };
    });

    return boxes;
  }

  calculateFloors(
    porchFloors: IFloorCoords[],
    porchCoords: { top: number; right: number; bottom: number; left: number },
  ): IFloorCoordsCalculate[] {
    const floors: IFloorCoordsCalculate[] = [];

    porchFloors.forEach((floor, index) => {
      const floorsSizes = this.floorsSizes[index];
      const top =
        index === 0 ? porchCoords.top : floors[index - 1].coords.bottom;
      const { left } = porchCoords;
      const coords = {
        top,
        right: left + floor.sizes.width,
        bottom: top + floorsSizes.height,
        left,
      };
      let points = [
        [coords.right, coords.bottom],
        [left, coords.bottom],
      ];
      if (floor.tower) {
        const offset = this.offset(config.sizes.porch.width, floor.sizes.width);
        coords.left = porchCoords.right - floor.sizes.width - offset;
        coords.right = coords.left + floor.sizes.width;
        points = [
          [coords.left, coords.bottom],
          [coords.left, top],
          [coords.right, top],
          [coords.right, coords.bottom],
        ];
      }

      if (index === porchFloors.length - 1) points = [];

      floors[index] = {
        ess: floor.ess,
        coords,
        points,
        boxes: this.calculateBoxes(floor.boxes, coords, floor.tower),
      };
    });

    return floors;
  }

  calculatePorches(): IPorchCoordsCalculate[] {
    const FLOOR_HEIGHT = config.sizes.floor.height;
    const porches: IPorchCoordsCalculate[] = [];

    this.porches.forEach((porch, index) => {
      const prevOffset = this.porches[index - 1]
        ? this.porches[index - 1].offset
        : 0;
      const fullHeight = this.floorsSizes.reduce(
        (sum, size) => sum + size.height,
        0,
      );
      const bottom = porch.offset * FLOOR_HEIGHT;
      const left = index === 0 ? this.x + 1 : porches[index - 1].coords.right;
      const coords = {
        top: bottom - fullHeight,
        right: left + porch.sizes.width,
        bottom,
        left,
      };
      const topPoint = porch.isTower
        ? coords.top + this.floorsSizes[0].height
        : coords.top;
      const points = [
        [left, topPoint],
        [coords.right, topPoint],
        [coords.right, coords.bottom],
        [left, coords.bottom],
      ];

      if (index === 0) points.push([left, topPoint]);

      if (porch.offset !== prevOffset) {
        const offset = porch.offset - prevOffset;
        if (offset > 0)
          points.push([left, coords.bottom - offset * FLOOR_HEIGHT]);
        else points.unshift([left, topPoint - offset * FLOOR_HEIGHT]);
      }

      porches[index] = {
        ess: porch.ess,
        coords,
        points,
        floors: this.calculateFloors(porch.floors, coords),
      };
    });

    return porches;
  }

  calculateSvg() {
    let width = 0;
    let height = 0;
    let offsetTop = 0; // смещение вверх (-)
    let offsetBottom = 0; // смещение вниз (+)

    this.porches.forEach((porch) => {
      const offset = porch.offset * config.sizes.floor.height;
      if (offsetTop > offset) offsetTop = offset;
      if (offsetBottom < offset) offsetBottom = offset;
      if (height < porch.sizes.height) height = porch.sizes.height;
      width += porch.sizes.width;
    });

    this.y += -height + offsetTop;
    height = offsetBottom + Math.abs(this.y);

    return {
      width,
      height,
      viewBox: [this.x, this.y, width + 2, height + 4],
    };
  }
}
