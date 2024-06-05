import { v4 as uuid } from 'uuid';
import AbstractClass from './AbstractClass';
import config from '../tools/config';

export default class SchemeFloor extends AbstractClass {
  get defaultOptions() {
    return {
      id: uuid(),
      name: '',
      type: 'tech', // [tech, default]
      visible: true,
      entity: false, // нежилой этаж
      moving: false, // можно двигать
      tower: false, // рисовка
      appt: 0, // количество квартир
      boxes: [], // [SchemeBox]
      porch: {}, // SchemePorch
      color: 'transparent', // цвет для дебага
    };
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

  setAppt(count) {
    this.appt = count;
  }

  setColor(color) {
    this.color = color;
  }
}
