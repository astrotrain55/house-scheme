import { AbstractClass } from './AbstractClass';
import config from '../tools/config';
import type { FloorType, IBox, IFloor, IPorch } from '../types';

export default class SchemeFloor extends AbstractClass implements IFloor {
  name: string;
  porch: IPorch; // SchemePorch
  type: FloorType = 'tech'; // [tech, default]
  visible: boolean = true;
  entity: boolean = false; // нежилой этаж
  moving: boolean = false; // можно двигать
  tower: boolean = false; // рисовка
  appt: number = 0; // количество квартир
  boxes: IBox[] = []; // [SchemeBox]
  color: string = 'transparent'; // цвет для дебага

  constructor(params: Partial<IFloor>) {
    super();
    this.name = params.name!;
    this.porch = params.porch!;
    if (params.type) this.type = params.type;
    if (params.appt) this.appt = params.appt;
    if (params.tower) this.tower = params.tower;
    if (params.boxes) this.boxes = params.boxes;
    if (params.moving) this.moving = params.moving;
    if (params.visible) this.visible = params.visible;
  }

  get sizes() {
    const { offset, towerWidth } = config.sizes.floor;
    const { width, captionWidth } = config.sizes.porch;
    const porchWidth = this.porch.visibleCaption ? width + captionWidth : width;
    const boxHeight = config.sizes.box.height;
    const countBoxes = this.boxes.length || 1;
    const countOffsets = countBoxes + 1;

    return {
      width: this.tower ? towerWidth : porchWidth,
      height: offset * countOffsets + boxHeight * countBoxes,
    };
  }

  toggle() {
    this.visible = !this.visible;
  }

  toggleEntity() {
    this.entity = !this.entity;
  }

  setAppt(count: number) {
    this.appt = count;
  }

  setColor(color: string) {
    this.color = color;
  }
}
