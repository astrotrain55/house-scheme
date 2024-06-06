import { v4 as uuid } from 'uuid';
import config from '../tools/config';
import type { IRiser, IRiserOptions, IRisers } from '../types';

export default class SchemeRisers implements IRisers {
  list: IRiser[];

  constructor() {
    this.list = this.fillList();
  }

  fillList() {
    const risers = [];

    for (let i = 0; i < config.riserCount; i += 1) {
      const riser = this.createRiser(i === 0);
      risers.push(riser);
    }

    return risers;
  }

  createRiser(internetVisible = false): IRiser {
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

  changeRise(index: number, options: IRiserOptions) {
    this.list[index].internet = options.internet;
    this.list[index].ktv = options.ktv;
    this.list[index].ktvCount = options.ktvCount;
  }

  get ktvCount() {
    return this.list
      .filter((riser: IRiser) => riser.ktv)
      .reduce((acc: number, riser: IRiser) => acc + riser.ktvCount, 0);
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
