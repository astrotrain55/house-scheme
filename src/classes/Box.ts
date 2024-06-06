import { AbstractClass } from './AbstractClass';
import config from '../tools/config';
import type { IBox, BoxType, IFloor } from '../types';

export default class SchemeBox extends AbstractClass implements IBox {
  type: BoxType; // [3, 8]
  name: string;
  origin: boolean = false; // привязанный изначально к дому
  receiverCount: number = 0; // количество приёмников
  floors: IFloor[] = []; // этажи ящика

  constructor(params: Partial<IBox>) {
    super();
    this.type = params.type!;
    this.name = params.name!;
    if (params.id) this.id = params.id;
    if (params.floors) this.floors = params.floors;
    if (params.origin) this.origin = params.origin;
  }

  get sizes() {
    return config.sizes.box;
  }

  setReceiverCount(count: number) {
    this.receiverCount = count;
  }
}
