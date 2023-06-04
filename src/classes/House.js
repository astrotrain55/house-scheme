import { v4 as uuid } from 'uuid';
import AbstractClass from './AbstractClass';

export default class SchemeHouse extends AbstractClass {
  get defaultOptions() {
    return {
      id: uuid(),
      nok: false,
      type: 'normal', // low, normal, high
      routingPosition: 'bottom', // top, bottom
      directionCalculation: 'left', // left, right
      boxesPosition: 'default', // default, tech
      visibleAll: false,
      debug: false,
    };
  }

  toggle(visibleAll) {
    this.visibleAll = visibleAll;
  }

  toggleDebug(debug) {
    this.debug = debug;
  }

  toggleRoutingPosition(routingPosition) {
    this.routingPosition = routingPosition;
  }

  toggleDirection(directionCalculation) {
    this.directionCalculation = directionCalculation;
  }

  toggleBoxesPosition(boxesPosition) {
    this.boxesPosition = boxesPosition;
  }
}
