import config from '../tools/config';

export default class Coords {
  constructor(porches, visibleAll) {
    this.porches = this.parsePorches(porches, visibleAll);

    this.x = -2;
    this.y = -2;

    this.floorsSizes = [];
  }

  parsePorches(porches, visibleAll) {
    const visibleFilter = (ess) => visibleAll || ess.visible;

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

  calculate() {
    this.floorsSizes = this.calculateFloorsSizes();

    return {
      svg: this.calculateSvg(),
      porches: this.calculatePorches(),
    };
  }

  offset(fullWidth, width) {
    return (fullWidth - width) / 2;
  }

  calculateFloorsSizes() {
    const floorsSizes = [];

    this.porches.forEach((porch) => {
      porch.floors.forEach((floor, index) => {
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

  calculateBoxes(floorBoxes, floorCoords, isTower) {
    const floorOffset = 5;
    const boxes = [];

    floorBoxes.forEach((box, index) => {
      const top = (index + 1) * floorOffset + index * box.sizes.height + floorCoords.top;
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

  calculateFloors(porchFloors, porchCoords) {
    const floors = [];

    porchFloors.forEach((floor, index) => {
      const floorsSizes = this.floorsSizes[index];
      const top = index === 0 ? porchCoords.top : floors[index - 1].coords.bottom;
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

  calculatePorches() {
    const FLOOR_HEIGHT = config.sizes.floor.height;
    const porches = [];

    this.porches.forEach((porch, index) => {
      const prevOffset = this.porches[index - 1] ? this.porches[index - 1].offset : 0;
      const fullHeight = this.floorsSizes.reduce((sum, size) => sum + size.height, 0);
      const bottom = porch.offset * FLOOR_HEIGHT;
      const left = index === 0 ? this.x + 1 : porches[index - 1].coords.right;
      const coords = {
        top: bottom - fullHeight,
        right: left + porch.sizes.width,
        bottom,
        left,
      };
      const topPoint = porch.isTower ? coords.top + this.floorsSizes[0].height : coords.top;
      const points = [
        [left, topPoint],
        [coords.right, topPoint],
        [coords.right, coords.bottom],
        [left, coords.bottom],
      ];

      if (index === 0) points.push([left, topPoint]);

      if (porch.offset !== prevOffset) {
        const offset = porch.offset - prevOffset;
        if (offset > 0) points.push([left, coords.bottom - offset * FLOOR_HEIGHT]);
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
