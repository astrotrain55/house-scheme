import { v4 as uuid } from 'uuid';
import config from '../tools/config';

export default class SchemeRisers {
  constructor() {
    this.list = this.fillList();
  }

  fillList() {
    const risers = [];

    for (let i = 0; i < config.riserCount; i++) {
      const riser = this.createRiser(i === 0);
      risers.push(riser);
    }

    return risers;
  }

  createRiser(internetVisible = false) {
    return {
      id: uuid(),
      internet: internetVisible,
      ktv: false,
      ktvCount: 4,
      get visible() {
        return this.internet || this.ktv;
      },
      get sizes() {
        return config.sizes.riser;
      },
    };
  }

  get ktvCount() {
    return this.list
      .filter((riser) => riser.ktv)
      .reduce((acc, riser) => acc + riser.ktvCount, 0);
  }

  changeRise(index, options = {}) {
    this.list[index].internet = options.internet;
    this.list[index].ktv = options.ktv;
    this.list[index].ktvCount = options.ktvCount;
  }

  get visibleInternet() {
    const riser = this.list.find((riser) => riser.internet);
    return Boolean(riser);
  }

  get visibleKtv() {
    const riser = this.list.find((riser) => riser.ktv && riser.ktvCount);
    return Boolean(riser);
  }
}
