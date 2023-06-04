import { v4 as uuid } from 'uuid';
import AbstractClass from './AbstractClass';
import config from '../tools/config';

export default class SchemeBox extends AbstractClass {
  get defaultOptions() {
    return {
      id: uuid(),
      type: '3', // [3, 8]
      name: '',
      origin: false, // привязанный изначально к дому
      receiverCount: 0, // количество приёмников
      floors: [], // этажи ящика
    };
  }

  get sizes() {
    return config.sizes.box;
  }

  setReceiverCount(count) {
    this.receiverCount = count;
  }
}
