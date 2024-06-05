const PORCH_MIN_WIDTH = 300;
const PORCH_CAPTION_WIDTH = 70;
const RISER_WIDTH = 40;
const FLOOR_OFFSET = 5;
const BOX_WIDTH = 70;
const BOX_HEIGHT = 40;
const FLOOR_TOWER_WIDTH = BOX_WIDTH + FLOOR_OFFSET * 2;
const FLOOR_MIN_HEIGHT = BOX_HEIGHT + FLOOR_OFFSET * 2;

export default {
  riserCount: 3,
  typesBoxes: [
    {
      type: '3',
      internet: 72,
      ktv: 120,
    },
    {
      type: '8',
      internet: 48,
      ktv: 0,
    },
  ],
  sizes: {
    porch: {
      width: PORCH_MIN_WIDTH,
      captionWidth: PORCH_CAPTION_WIDTH,
    },
    riser: {
      width: RISER_WIDTH,
    },
    floor: {
      towerWidth: FLOOR_TOWER_WIDTH,
      offset: FLOOR_OFFSET,
      height: FLOOR_MIN_HEIGHT,
    },
    box: {
      width: BOX_WIDTH,
      height: BOX_HEIGHT,
    },
  },
  colors: {
    between: {
      name: 'Межподъезды',
      value: '#4169e1',
      default: '#4169e1',
    },
    lines: {
      name: 'Интернет',
      value: '#8a2be2',
      default: '#f3ff23', // 4b0082
    },
    box: {
      name: 'Ящики',
      value: '#ffffff',
      default: '#ffffff', // ff7f50
    },
    ktv: {
      name: 'КТВ',
      value: '#00ff00',
      default: '#00ff00',
    },
  },
};
