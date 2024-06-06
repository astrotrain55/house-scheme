import randomColor from 'randomcolor';
import House from './House';
import Porch from './Porch';
import Floor from './Floor';
import Box from './Box';
import Coords from './Coords';
import config from '../tools/config';
import calculateNumbers, {
  type INumbers,
  type IItem,
} from '../tools/calculateNumbers';
import type {
  BoxTypeWithColor,
  HouseRoutingPosition,
  IBox,
  IFloor,
  IHouse,
  IOptions,
  IPorch,
} from '../types';
import type { IPorchRaw } from '../types/porch.types';

export default class SchemeHouse {
  options: IOptions;
  house: IHouse;
  porches: IPorch[] = [];

  constructor(options: IOptions) {
    this.options = options;
  }

  log(title = 'Debug', ...args: any[]) {
    console.log(`%c${title}`, 'background-color: white;color: black;', ...args);
  }

  getMaxCountPorchDefault(type: string) {
    return type === 'low' ? 2 : 1;
  }

  clearBoxes() {
    this.porches.forEach((porch) => {
      porch.floors.forEach((floor) => {
        floor.boxes.forEach((box, i) => {
          if (!box.origin) floor.boxes.splice(i, 1);
        });
      });
    });
  }

  searchBox() {
    for (let p = 0; p < this.porches.length; p += 1) {
      const porch = this.porches[p];

      for (let f = 0; f < porch.floors.length; f += 1) {
        const floor = porch.floors[f];

        for (let b = 0; b < floor.boxes.length; b += 1) {
          const box = floor.boxes[b];
          if (porch.visible && box.origin) return p;
        }
      }
    }

    return null;
  }

  autoBoxes() {
    const { boxesPosition, routingPosition, type } = this.house;

    if (type === 'high') {
      if (boxesPosition === 'default')
        this.autoBoxesDefaultHigh(routingPosition);
      if (boxesPosition === 'tech') this.autoBoxesTechHigh(routingPosition);
    } else {
      const porchNumber = this.searchBox();
      const leftPart = [];
      const rightPart = [];

      for (let i = 0; i < this.porches.length; i += 1) {
        if (i < Number(porchNumber)) leftPart.push(i);
        if (i > Number(porchNumber)) rightPart.push(i);
      }

      const typesBoxes = config.typesBoxes.map((type) => ({
        ...type,
        color: randomColor(),
      }));

      const options = {
        search: {
          type: `center-${this.house.directionCalculation}`,
          leftPorch: Number(porchNumber) - 1,
          rightPorch: Number(porchNumber) + 1,
          leftPart,
          rightPart,
          leftMax: type === 'low' ? 2 : 1,
          rightMax: type === 'low' ? 2 : 1,
        },
        typesBoxes,
        porchNumber,
        routingPosition,
        type,
        remainderMaxInternet: 150,
      };

      if (boxesPosition === 'default') this.testNewLogic();
      if (boxesPosition === 'tech') this.autoBoxesTech(options);
    }
  }

  testNewLogic() {
    const { routingPosition, directionCalculation, type } = this.house;
    const porchNumber = this.searchBox();
    const parts = {
      left: [] as number[],
      right: [] as number[],
    };

    for (let i = 0; i < this.porches.length; i += 1) {
      if (i < Number(porchNumber)) parts.left.push(i);
      if (i > Number(porchNumber)) parts.right.push(i);
    }

    this.newLogicAutoBoxes(config.typesBoxes, {
      porchNumber,
      parts,
      type,
      isBottom: routingPosition === 'bottom',
      direction: `center-${directionCalculation}`,
      maxInternet: 150,
      maxCountPorchLeft: this.getMaxCountPorchDefault(type),
      maxCountPorchRight: this.getMaxCountPorchDefault(type),
    });
  }

  getTypesNew(newBox?: BoxTypeWithColor | 'null') {
    const typesBoxes: BoxTypeWithColor[] = [...config.typesBoxes];
    if (newBox === 'null') typesBoxes.shift();
    else if (newBox) typesBoxes[0] = newBox;
    return typesBoxes;
  }

  newLogicAutoBoxes(types: BoxTypeWithColor[], params: any) {
    this.log(
      'newLogicAutoBoxes start',
      'Подъезд',
      params.porchNumber + 1,
      JSON.parse(JSON.stringify(types)),
      JSON.parse(JSON.stringify(params)),
    );
    const porch = this.porches[params.porchNumber];
    const { visibleInternet, visibleKtv } = porch.risers;
    const floors = porch.floors.filter(
      (f) => f.visible && f.type === 'default',
    );
    if (params.isBottom) floors.reverse();
    const apartmentsCount = floors.reduce((acc, floor) => acc + floor.appt, 0);
    const maxInternet =
      params.maxInternet < apartmentsCount ? 150 : params.maxInternet;
    const { boxes, remains, isFantom } = this.newLogicParsePorch(types, {
      visibleInternet,
      visibleKtv,
      apartmentsCount,
      maxInternet,
    });
    const fantomBox: BoxTypeWithColor = {
      type: `П${params.porchNumber + 1}`,
      internet: params.type === 'low' ? remains.internet : 0,
      ktv: remains.ktv,
      color: boxes.length ? boxes[boxes.length - 1].color : randomColor(),
    };

    this.generateBoxesDefault([...boxes], [...floors]);

    let typesBoxes = this.getTypesNew();

    if (isFantom) {
      typesBoxes = this.getTypesNew(fantomBox);
    } else if (
      (params.type === 'low' || !visibleKtv) &&
      remains.maxInternet >= apartmentsCount
    ) {
      typesBoxes = this.getTypesNew('null');
    }

    if (
      params.direction === 'center-left' &&
      params.parts.left.length &&
      params.maxCountPorchLeft
    ) {
      params.porchNumber = params.parts.left.pop();
      params.maxCountPorchLeft = params.maxCountPorchLeft
        ? params.maxCountPorchLeft - 1
        : this.getMaxCountPorchDefault(params.type);
    } else if (
      params.direction === 'center-left' &&
      params.parts.right.length &&
      params.maxCountPorchRight
    ) {
      params.direction = 'center-right';
      params.porchNumber = params.parts.right.shift();
      params.maxCountPorchRight = params.maxCountPorchRight
        ? params.maxCountPorchRight - 1
        : this.getMaxCountPorchDefault(params.type);
    } else if (
      params.direction === 'center-right' &&
      params.parts.right.length &&
      params.maxCountPorchRight
    ) {
      params.porchNumber = params.parts.right.shift();
      params.maxCountPorchRight = params.maxCountPorchRight
        ? params.maxCountPorchRight - 1
        : this.getMaxCountPorchDefault(params.type);
    } else if (
      params.direction === 'center-right' &&
      params.parts.left.length &&
      params.maxCountPorchLeft
    ) {
      params.direction = 'center-left';
      params.porchNumber = params.parts.left.pop();
      params.maxCountPorchLeft = params.maxCountPorchLeft
        ? params.maxCountPorchLeft - 1
        : this.getMaxCountPorchDefault(params.type);
    } else if (params.parts.right.length) {
      if (params.direction !== 'right') typesBoxes = this.getTypesNew();
      params.direction = 'right';
      params.porchNumber = params.parts.right.shift();
      params.maxCountPorchRight = params.maxCountPorchRight
        ? params.maxCountPorchRight - 1
        : this.getMaxCountPorchDefault(params.type);
    } else if (params.parts.left.length) {
      if (params.direction !== 'left') typesBoxes = this.getTypesNew();
      params.direction = 'left';
      params.porchNumber = params.parts.left.pop();
      params.maxCountPorchLeft = params.maxCountPorchLeft
        ? params.maxCountPorchLeft - 1
        : this.getMaxCountPorchDefault(params.type);
    } else return;

    if (
      !isFantom &&
      ['center-left', 'center-right'].includes(params.direction)
    ) {
      if (params.parts.left.length) params.direction = 'left';
      else if (params.parts.right.length) params.direction = 'right';
    }

    if (this.porches[params.porchNumber]) {
      this.newLogicAutoBoxes(typesBoxes, {
        porchNumber: params.porchNumber,
        parts: params.parts,
        type: params.type,
        isBottom: params.isBottom,
        direction: params.direction,
        maxInternet: remains.maxInternet,
        maxCountPorchLeft: params.maxCountPorchLeft,
        maxCountPorchRight: params.maxCountPorchRight,
      });
    }
  }

  newLogicParsePorch(types: BoxTypeWithColor[], options: any): any {
    const boxes: any[] = [];
    let remainderMaxInternet = options.maxInternet;
    let remainderInternet = options.visibleInternet
      ? options.apartmentsCount
      : 0;
    let remainderKtv = options.visibleKtv ? options.apartmentsCount : 0;

    recursiveHandler();

    function recursiveHandler(start = 0) {
      const typesBoxes: BoxTypeWithColor[] =
        remainderMaxInternet === 150 ? config.typesBoxes : types;
      const isParsePorch = () => {
        const isInternet = options.visibleInternet && remainderInternet > 0;
        const isKtv = options.visibleKtv && remainderKtv > 0;
        return isInternet || isKtv;
      };

      for (let i = start; i < typesBoxes.length; i += 1) {
        if (!isParsePorch()) break;
        const type: BoxTypeWithColor = typesBoxes[i];
        const nextType = typesBoxes[i + 1];

        boxes.push({
          ...type,
          color: randomColor(),
          floors: [],
        });

        if (options.visibleInternet) remainderMaxInternet -= type.internet;
        if (options.visibleInternet) remainderInternet -= type.internet;
        if (options.visibleKtv) remainderKtv -= type.ktv;

        if (remainderInternet > 0 || remainderKtv > 0) {
          if (
            (nextType && remainderMaxInternet >= nextType.internet) ||
            remainderKtv > 0
          ) {
            recursiveHandler(i + 1);
          } else if (remainderInternet > 0) {
            recursiveHandler();
          }
        }
      }
    }

    const fantom = boxes.find((b) => b.type.includes('П'));

    if (boxes.length > 1 && fantom) {
      return this.newLogicParsePorch(types, options);
    }
    return {
      boxes,
      isFantom: Boolean(fantom) && boxes.length === 1,
      remains: {
        internet: Math.abs(remainderInternet),
        ktv: Math.abs(remainderKtv),
        maxInternet: remainderMaxInternet,
      },
    };
  }

  parsePorch(
    porch: IPorch,
    apptCount: number,
    types: BoxTypeWithColor[],
    options: any = {},
  ): any {
    const { visibleInternet, visibleKtv } = porch.risers;
    const boxes: any[] = [];
    let remainderInternet = visibleInternet ? apptCount : 0;
    let remainderKtv = visibleKtv ? apptCount : 0;

    recursiveHandler();

    function recursiveHandler(start = 0) {
      for (let i = start; i < types.length; i += 1) {
        if (visibleInternet && visibleKtv) {
          if (remainderInternet <= 0 && remainderKtv <= 0) break;
        } else if (visibleInternet) {
          if (remainderInternet <= 0) break;
        } else if (visibleKtv) {
          if (remainderKtv <= 0) break;
        }

        const type = types[i];
        boxes.push({
          ...type,
          floors: [],
        });

        if (visibleInternet) remainderInternet -= type.internet;
        if (visibleKtv) remainderKtv -= type.ktv;

        if (remainderInternet > 0) {
          if (remainderKtv > 0) {
            recursiveHandler();
          } else if (options.remainderMaxInternet) {
            recursiveHandler(i + 1);
          } else {
            recursiveHandler();
          }
        }
      }
    }

    const fantom = boxes.find((b) => b.type.includes('П'));

    if (boxes.length > 1 && fantom) {
      if (options.search.type === 'center-left') options.search.type = 'right';
      if (options.search.type === 'center-right') options.search.type = 'left';

      return this.parsePorch(porch, apptCount, config.typesBoxes, options);
    }
    return {
      internet: Math.abs(remainderInternet),
      ktv: Math.abs(remainderKtv),
      boxes,
      remainderMaxInternet: options.remainderMaxInternet,
    };
  }

  autoBoxesTech(options: any) {
    const porch = this.porches[options.porchNumber];
    if (!porch) return;
    const { visibleInternet, visibleKtv } = porch.risers;
    if (!visibleInternet && !visibleKtv) return;

    const floors = porch.floors.filter((ess) => ess.visible);
    if (options.routingPosition === 'bottom') floors.reverse();

    let apptCount = 0;
    let originBox = null;

    floors.forEach((floor) => {
      apptCount += floor.appt;

      if (floor.boxes.length) {
        originBox = floor.boxes[0];
        floor.boxes = [];
      }
    });

    function getTypes(box?: BoxTypeWithColor) {
      const types: BoxTypeWithColor[] = config.typesBoxes.map((type) => ({
        ...type,
        color: randomColor(),
      }));
      if (box) types[0] = box;
      return types;
    }
    const { boxes, internet, ktv } = this.parsePorch(
      porch,
      apptCount,
      options.typesBoxes,
      options,
    );
    const countBoxes = boxes.length;
    const box: BoxTypeWithColor = {
      type: `П${options.porchNumber + 1}`,
      internet: options.type === 'low' ? internet : 0,
      ktv,
    };
    const typesBoxes = !box.ktv && !box.internet ? getTypes() : getTypes(box);
    box.color = countBoxes ? boxes[boxes.length - 1].color : randomColor();

    let startTech: IFloor | null = null;
    let endTech: IFloor | null = null;

    floors.forEach((floor, index) => {
      if (index === 0) return;
      const prevTech = floors[index - 1];
      if (!startTech) {
        if (prevTech.type === 'tech' && floor.type === 'default')
          startTech = prevTech;
      }
      if (startTech && !endTech) {
        if (prevTech.type === 'default' && floor.type === 'tech')
          endTech = floor;
      }
    });

    if (startTech && endTech) {
      this.generateBoxesTech(boxes, originBox, startTech, endTech);
    }

    if (countBoxes === 1) {
      if (
        options.search.type === 'center-left' &&
        options.search.rightPart.length
      ) {
        options.search.type = 'center-right';
        options.porchNumber = options.search.leftPorch;
        options.search.leftPorch = options.search.leftPorch - 1;
        options.search.leftPart.pop();
        options.typesBoxes = typesBoxes;
      } else if (
        options.search.type === 'center-right' &&
        options.search.leftPart.length
      ) {
        options.search.type = 'center-left';
        options.porchNumber = options.search.rightPorch;
        options.search.rightPorch = options.search.rightPorch + 1;
        options.search.rightPart.shift();
        options.typesBoxes = typesBoxes;
      } else if (
        (options.search.type === 'left' && options.search.leftPart.length) ||
        (options.search.type === 'right' && !options.search.rightPart.length)
      ) {
        options.search.type = 'left';
        options.porchNumber = options.search.leftPorch;
        options.search.leftPorch = options.search.leftPorch - 1;
        options.search.leftPart.pop();
        options.typesBoxes = getTypes(box);
      } else {
        options.typesBoxes =
          options.search.type !== 'right' ? getTypes() : typesBoxes;
        options.search.type = 'right';
        options.porchNumber = options.search.rightPorch;
        options.search.rightPorch = options.search.rightPorch + 1;
        options.search.rightPart.shift();
      }
    } else if (
      (options.search.type !== 'right' && options.search.leftPart.length) ||
      (options.search.type === 'right' && !options.search.rightPart.length)
    ) {
      options.search.type = 'left';
      options.porchNumber = options.search.leftPorch;
      options.search.leftPorch = options.search.leftPorch - 1;
      options.search.leftPart.pop();
      options.typesBoxes = getTypes();
    } else {
      options.search.type = 'right';
      options.porchNumber = options.search.rightPorch;
      options.search.rightPorch = options.search.rightPorch + 1;
      options.search.rightPart.shift();
      options.typesBoxes = getTypes();
    }

    this.autoBoxesTech({
      search: options.search,
      typesBoxes: options.typesBoxes,
      porchNumber: options.porchNumber,
      routingPosition: options.routingPosition,
      type: options.type,
    });
  }

  autoBoxesTechHigh(routingPosition: HouseRoutingPosition) {
    const isVisible = (ess: IPorch | IFloor) => ess.visible;

    this.porches.filter(isVisible).forEach((porch) => {
      const { visibleInternet, visibleKtv } = porch.risers;
      if (!visibleInternet && !visibleKtv) return;

      const floors = porch.floors.filter(isVisible);
      if (routingPosition === 'bottom') floors.reverse();

      let apptCount = 0;
      let originBox: IBox | null = null;

      floors.forEach((floor) => {
        apptCount += floor.appt;

        if (floor.boxes.length) {
          originBox = floor.boxes[0];
          floor.boxes = [];
        }
      });

      const { boxes } = this.parsePorch(porch, apptCount, config.typesBoxes);

      let startTech: IFloor | null = null;
      let endTech: IFloor | null = null;

      floors.forEach((floor, index) => {
        if (index === 0) return;
        const prevTech = floors[index - 1];
        if (!startTech) {
          if (prevTech.type === 'tech' && floor.type === 'default')
            startTech = prevTech;
        }
        if (startTech && !endTech) {
          if (prevTech.type === 'default' && floor.type === 'tech')
            endTech = floor;
        }
      });

      if (startTech && endTech) {
        this.generateBoxesTech(boxes, originBox, startTech, endTech);
      }
    });
  }

  generateBoxesTech(
    boxes: any[],
    originBox: IBox | null,
    startTech: IFloor,
    endTech: IFloor,
  ) {
    boxes.forEach((typeBox, index: number) => {
      if (index === 0 && originBox) {
        startTech.boxes.push(originBox);
      } else {
        const box = new Box({
          type: typeBox.type,
          name: typeBox.type,
        });

        if (index % 2 === 0) {
          startTech.boxes.push(box);
        } else {
          endTech.boxes.push(box);
        }
      }
    });
  }

  autoBoxesDefaultHigh(routingPosition: HouseRoutingPosition) {
    const isVisible = (ess: IPorch | IFloor) => ess.visible;

    this.porches.filter(isVisible).forEach((porch) => {
      const { visibleInternet, visibleKtv } = porch.risers;
      if (!visibleInternet && !visibleKtv) return;

      const floors = porch.floors
        .filter(isVisible)
        .filter((f) => f.type === 'default');
      if (routingPosition === 'bottom') floors.reverse();
      let apptCount = 0;

      floors.forEach((floor) => {
        apptCount += floor.appt;
      });

      const { boxes } = this.parsePorch(porch, apptCount, config.typesBoxes);
      this.generateBoxesDefault(boxes, floors);
    });
  }

  getPart(floors: IFloor[], limit: number, box: any) {
    if (!box) return;

    const { type, color } = box;
    const sector = [];
    const boxFloors = [];
    let empty = true;

    for (let i = 0; i < limit; i += 1) {
      const f = floors.shift();

      if (!f) break;
      boxFloors.push(f);
      f.setColor(color);

      if (f.boxes.length) {
        // console.log(f.boxes.length);
        empty = false;
        break;
      }

      sector.push(f);
    }
    const [floor] = sector;
    if (empty) {
      floor.boxes.push(
        new Box({
          name: type,
          type,
          floors: boxFloors,
        }),
      );
    }
  }

  getCenter(floors: IFloor[], limit: number, box: any) {
    const { type, color } = box;
    const sector = [];
    const boxFloors = [];
    let empty = true;

    for (let i = 0; i < limit; i += 1) {
      const f = floors.pop();

      if (!f) break;
      boxFloors.push(f);
      f.setColor(color);

      if (f.boxes.length) {
        // console.log(f.boxes.length);
        empty = false;
        break;
      }

      sector.push(f);
    }
    const index = Math.ceil(sector.length / 2);
    if (empty && sector[index]) {
      sector[index].boxes.push(
        new Box({
          name: type,
          type,
          floors: boxFloors,
        }),
      );
    }
  }

  generateBoxesDefault(typesList: any[], floors: IFloor[]) {
    const limit = Math.ceil(floors.length / typesList.length);
    this.getPart(floors, limit, typesList.shift());
    this.getPart(floors.reverse(), limit, typesList.pop());

    if (typesList.length && floors.length) {
      const newLimit = Math.ceil(floors.length / typesList.length);

      typesList.forEach((type) => {
        this.getCenter(floors, newLimit, type);
      });
    }
  }

  movingBox(dir: string, id: string) {
    const movingBox = (options: any) => {
      const porch = this.porches[options.porchIndex];
      const floor = porch.floors[options.floorIndex];
      const box = floor.boxes[options.boxIndex];
      const boxCount = floor.boxes.length;
      const floorCount = porch.floors.length;

      if (dir === 'up' && options.boxIndex === 0) {
        const index = recursive(options.floorIndex);
        if (!index && index !== 0) return;
        if (index < 0) return;
        floor.boxes = floor.boxes.filter((b) => b !== box);
        porch.floors[index].boxes.push(box);
      } else if (dir === 'down' && options.boxIndex === boxCount - 1) {
        const index = recursive(options.floorIndex);
        if (!index) return;
        if (index === floorCount) return;
        floor.boxes = floor.boxes.filter((b) => b !== box);
        porch.floors[index].boxes.unshift(box);
      } else {
        const index =
          dir === 'up' ? options.boxIndex - 1 : options.boxIndex + 1;
        [floor.boxes[options.boxIndex], floor.boxes[index]] = [
          floor.boxes[index],
          floor.boxes[options.boxIndex],
        ];
      }

      function recursive(indexFloor: number) {
        const index = dir === 'up' ? indexFloor - 1 : indexFloor + 1;
        const floor = porch.floors[index];
        if (!floor) return null;
        if (floor.visible) return index;
        return recursive(index);
      }
    };

    let options: any = null;

    this.porches.forEach((porch, porchIndex) => {
      porch.floors.forEach((floor, floorIndex) => {
        const boxIndex = floor.boxes.findIndex((box) => box.id === id);
        if (!options && boxIndex >= 0) {
          options = {
            porchIndex,
            floorIndex,
            boxIndex,
          };
        }
      });
    });

    movingBox(options);
  }

  movingTechFloor(dir: string, floor: any) {
    const [firstPorch] = this.porches;
    const indexFloor = firstPorch.floors.findIndex(
      (f) => f.name === floor.name,
    );
    if (indexFloor < 0) return;
    const index = recursive(indexFloor);
    if (!index) return;

    this.porches.forEach((porch) => {
      [porch.floors[indexFloor], porch.floors[index]] = [
        porch.floors[index],
        porch.floors[indexFloor],
      ];
    });

    function recursive(indexFloor: number) {
      const index = dir === 'up' ? indexFloor - 1 : indexFloor + 1;
      const floor = firstPorch.floors[index];
      if (!floor || floor.tower) return null;
      if (floor.visible) return index;
      return recursive(index);
    }
  }

  getCoords() {
    const coords = new Coords(this.porches, this.house.visibleAll);
    return coords.calculate();
  }

  calculate() {
    const { house } = this.options;
    const countFloors = Number(house.UF_FLOORS);
    const type = countFloors < 6 ? 'low' : countFloors > 12 ? 'high' : 'normal';
    const numbers = calculateNumbers({
      countPorches: Number(house.UF_PODJEZD_NUM),
      countFloors,
      countAppt: Number(house.UF_APPT_NUM),
      db: house.UF_APT_NUMBERS,
    });

    this.house = new House({
      id: house.UF_XML_ID,
      nok: Boolean(house.UF_APT_NUMBERS.length),
      type,
    });
    this.porches = this.calculatePorches(countFloors, numbers, this.house);
  }

  get sizes() {
    return this.porches
      .filter((porch) => porch.visible)
      .reduce(
        (acc, porch) => {
          acc.width += porch.sizes.width;
          if (acc.height < porch.sizes.height) acc.height = porch.sizes.height;
          return acc;
        },
        {
          width: 0,
          height: 0,
        },
      );
  }

  calculatePorches(countFloors: number, numbers: INumbers, house: IHouse) {
    return this.options.porches.map((mapPorch, i) => {
      const numbersPorch: IItem = numbers[mapPorch.UF_NUMBER];
      const porch: IPorch = new Porch({
        id: mapPorch.UF_XML_ID,
        name: `Подъезд ${mapPorch.UF_NUMBER}`,
        appt: numbersPorch.count,
        visibleCaption: i === 0,
        house,
      });

      const floors = this.calculateFloors(
        porch,
        mapPorch,
        countFloors,
        numbersPorch.floors,
      );

      porch.setFloors(floors);

      return porch;
    });
  }

  calculateFloors(
    porch: IPorch,
    mapPorch: IPorchRaw,
    countFloors: number,
    numbersFloor: Record<string, number>,
  ) {
    const floors = [];
    const techFloors = this.getListTechFloors(porch, mapPorch);

    for (let counter = 0; counter < countFloors; counter += 1) {
      const floorNumber = counter + 1;

      floors.push(
        new Floor({
          type: 'default',
          name: `${floorNumber} этаж`,
          appt: numbersFloor[floorNumber],
          boxes: this.calculateBoxes(mapPorch, floorNumber),
          porch,
        }),
      );
    }

    return [
      techFloors.tower,
      techFloors.attic,
      techFloors.tech,
      ...floors.reverse(),
      techFloors.techBasement,
      techFloors.ground,
      techFloors.basement,
    ];
  }

  calculateBoxes(mapPorch: IPorchRaw, floorNumber: number): IBox[] {
    const boxes: IBox[] = [];
    const mapBox = this.options.box;
    const isPorch = mapPorch.UF_XML_ID === mapBox.UF_PORCH_ID;
    const isFloor = floorNumber === Number(mapBox.UF_BOX_PLACEMENT);

    if (isPorch && isFloor) {
      boxes.push(
        new Box({
          id: mapBox.UF_XML_ID,
          name: mapBox.UF_BOX_TYPE,
          type: mapBox.UF_BOX_TYPE.includes('8') ? '8' : '3',
          origin: true,
        }),
      );
    }

    return boxes;
  }

  getListTechFloors(porch: IPorch, mapPorch: IPorchRaw) {
    return {
      tower: new Floor({
        name: 'Надстройка',
        visible: mapPorch.UF_UPPER === '1',
        tower: true,
        porch,
      }),
      attic: new Floor({
        name: 'Чердак',
        visible: mapPorch.UF_LOFT === '1',
        porch,
      }),
      tech: new Floor({
        name: 'Тех.этаж',
        visible: mapPorch.UF_TECH === '1',
        moving: true,
        porch,
      }),
      techBasement: new Floor({
        name: 'Тех.подполье',
        visible: true,
        moving: true,
        porch,
      }),
      ground: new Floor({
        name: 'Цоколь',
        visible: mapPorch.UF_GROUND === '1',
        porch,
      }),
      basement: new Floor({
        name: 'Подвал',
        visible: mapPorch.UF_BASEMENT === '1',
        porch,
      }),
    };
  }
}
