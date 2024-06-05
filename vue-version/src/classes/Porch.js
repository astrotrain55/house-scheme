import { v4 as uuid } from 'uuid';
import AbstractClass from './AbstractClass';
import Risers from './Risers';
import config from '../tools/config';

export default class SchemePorch extends AbstractClass {
  get defaultOptions() {
    return {
      id: uuid(),
      name: '',
      visible: true,
      visibleCaption: false, // показ названий этажей
      offset: 0, // Сдвиг подъезда
      appt: 0, // Количество квартир
      risers: new Risers(), // Стояки
      floors: [], // [SchemeFloor]
      visibleAll() {
        return false; // ??
      },
    };
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

  setFloors(floors) {
    this.floors = floors;
  }

  get isTower() {
    const tower = this.floors.find((floor) => floor.tower);
    return this.visibleAll() || tower.visible;
  }

  toggle() {
    this.visible = !this.visible;
  }

  toggleCaption() {
    this.visibleCaption = !this.visibleCaption;
  }

  changeOffset(offset) {
    this.offset = offset;
  }
}
