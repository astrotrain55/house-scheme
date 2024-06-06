import { AbstractClass } from './AbstractClass';
import type {
  HouseBoxesPosition,
  HouseDirection,
  HouseRoutingPosition,
  HouseType,
  IHouse,
} from '../types';

export default class SchemeHouse extends AbstractClass implements IHouse {
  public nok: boolean;
  public type: HouseType; // low, normal, high
  public routingPosition: HouseRoutingPosition = 'bottom'; // top, bottom
  public directionCalculation: HouseDirection = 'left'; // left, right
  public boxesPosition: HouseBoxesPosition = 'default'; // default, tech
  public visibleAll: boolean = false;
  public debug: boolean = false;

  constructor(params: Partial<IHouse>) {
    super();
    this.id = params.id!;
    this.nok = params.nok!;
    this.type = params.type!;
  }

  toggle(visibleAll: boolean) {
    this.visibleAll = visibleAll;
  }

  toggleDebug(debug: boolean) {
    this.debug = debug;
  }

  toggleRoutingPosition(routingPosition: HouseRoutingPosition) {
    this.routingPosition = routingPosition;
  }

  toggleDirection(directionCalculation: HouseDirection) {
    this.directionCalculation = directionCalculation;
  }

  toggleBoxesPosition(boxesPosition: HouseBoxesPosition) {
    this.boxesPosition = boxesPosition;
  }
}
