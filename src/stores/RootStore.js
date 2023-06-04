import { defineStore } from 'pinia';
import { calculateScheme } from '@/classes';
import configScheme from '@/tools/config';

const defaultOptions = {
  house: {
    UF_XML_ID: '0F7781D6-9048-E571-0382-0B3422B1DCF4',
    UF_APT_NUMBERS: false,
    UF_APPT_NUM: '216',
    UF_FLOORS: '9',
    UF_PODJEZD_NUM: '4',
  },
  box: {
    UF_XML_ID: '5063BA29-35DC-E38D-019B-55333970DB77',
    UF_PORCH_ID: '349580BB-BF30-925D-1342-E1CE498FDC02',
    UF_BOX_PLACEMENT: '9', // этаж
    UF_BOX_TYPE: 'Оптический ящик 3',
  },
  porches: [
    {
      UF_XML_ID: '6E1DF3D3-CE72-B985-2F5A-518483252050',
      UF_NUMBER: '1',
      UF_UPPER: '1',
      UF_LOFT: '',
      UF_TECH: '1',
      UF_GROUND: '',
      UF_BASEMENT: '1',
    },
    {
      UF_XML_ID: 'C6CF6A1F-95AF-48AC-6EC2-1780F6BA742A',
      UF_NUMBER: '2',
      UF_UPPER: '1',
      UF_LOFT: '',
      UF_TECH: '1',
      UF_GROUND: '',
      UF_BASEMENT: '1',
    },
    {
      UF_XML_ID: '349580BB-BF30-925D-1342-E1CE498FDC02',
      UF_NUMBER: '3',
      UF_UPPER: '1',
      UF_LOFT: '',
      UF_TECH: '1',
      UF_GROUND: '',
      UF_BASEMENT: '1',
    },
    {
      UF_XML_ID: '75DB9D8A-FBB2-4A50-525C-268684A7FA3D',
      UF_NUMBER: '4',
      UF_UPPER: '1',
      UF_LOFT: '',
      UF_TECH: '1',
      UF_GROUND: '',
      UF_BASEMENT: '1',
    },
  ],
};

function initScheme(options) {
  const config = calculateScheme(options);
  const coords = config.getCoords();
  return {
    config,
    coords,
  };
}

const { config, coords } = initScheme(defaultOptions);
const colors = configScheme.colors;

export const useRootStore = defineStore('RootStore', {
  state() {
    return {
      config,
      coords,
      colors,
    };
  },
  getters: {
    porches: (state) => state.config.porches,
  },
  actions: {
    initLogScheme() {
      const { config, coords } = initScheme(defaultOptions);
      console.info({ config, coords });
    },

    createScheme(options) {
      console.log(JSON.parse(JSON.stringify(options)));
      const { config, coords } = initScheme(options);
      this.config = config;
      this.coords = coords;
    },

    createDefaultScheme() {
      console.log(JSON.parse(JSON.stringify(defaultOptions)));
      const { config, coords } = initScheme(defaultOptions);
      this.config = config;
      this.coords = coords;
    },

    updateCoords() {
      this.coords = this.config.getCoords();
      console.info('house', this.config.house);
      console.info('porches', this.config.porches);
    },
    movingTechFloor(params) {
      this.config.movingTechFloor(...params);
      this.updateCoords();
    },

    movingBox([dir, id]) {
      this.config.movingBox(dir, id);
      this.updateCoords();
    },

    autoBoxes() {
      this.config.clearBoxes();
      this.config.autoBoxes();
      this.updateCoords();
    },
  },
});
