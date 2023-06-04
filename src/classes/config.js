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
      width: 300,
      captionWidth: 70,
    },
    riser: {
      width: 40,
      height: 40,
    },
    floor: {
      towerWidth: 80,
      offset: 5,
    },
    box: {
      width: 70,
      height: 40,
    },
  },
  colors: {
    between: {
      name: 'Межподъезды',
      value: '#ff0000',
      default: '#ff0000',
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
