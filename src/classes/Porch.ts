import { AbstractClass } from './AbstractClass';
import Risers from './Risers';
import config from '../tools/config';
import type { IFloor, IHouse, IPorch, IRisers } from '../types';

export default class SchemePorch extends AbstractClass implements IPorch {
  public name: string = '';
  public appt: number; // Количество квартир
  public house: IHouse;
  public visibleCaption: boolean; // показ названий этажей
  public visible: boolean = true;
  public offset: number = 0; // Сдвиг подъезда
  public risers: IRisers = new Risers(); // Стояки
  public floors: IFloor[] = []; // [SchemeFloor]

  constructor(params: Partial<IPorch>) {
    super();
    this.id = params.id!;
    this.name = params.name!;
    this.appt = params.appt!;
    this.house = params.house!;
    this.visibleCaption = params.visibleCaption!;
  }

  visibleAll() {
    return this.house.visibleAll;
  }

  debug() {
    return this.house.debug;
  }

  get sizes() {
    const { width, captionWidth } = config.sizes.porch;
    const fullWidth = this.visibleCaption ? width + captionWidth : width;
    const fullHeight = this.floors
      .filter((floor) => this.visibleAll() || floor.visible)
      .reduce((acc, floor) => acc + floor.sizes.height, 0);

    return {
      width: fullWidth,
      height: fullHeight,
    };
  }

  setFloors(floors: IFloor[]) {
    this.floors = floors;
  }

  get isTower() {
    const tower: IFloor | undefined = this.floors.find((floor) => floor.tower);
    return this.visibleAll() || Boolean(tower?.visible);
  }

  toggle() {
    this.visible = !this.visible;
  }

  toggleCaption() {
    this.visibleCaption = !this.visibleCaption;
  }

  changeOffset(offset: number) {
    this.offset = offset;
  }
}
