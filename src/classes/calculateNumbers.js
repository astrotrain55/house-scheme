const calcAppt = (countAppt, countPorches) => {
  // делим все квартиры на количество подъездов
  const apptInPorch = Math.floor(countAppt / countPorches);
  // если не делится то вычисляем остаток
  const balancePorch = countAppt - (apptInPorch * countPorches);

  return (indexPorch) => (indexPorch === 0) ? apptInPorch + balancePorch : apptInPorch;
};

const getApptInFloor = (apptInPorch, countFloors) => {
  const apptResult = Math.floor(apptInPorch / countFloors);
  const remainder = countFloors - (apptInPorch % countFloors);
  const result = [];

  for (let i = countFloors; i > 0; i--) {
    result.unshift((i > remainder) ? apptResult + 1 : apptResult);
  }

  return (indexFloor) => result[indexFloor];
}

const getListApptInFloor = (countAppt, countFloors) => {
  const listFloors = {};
  const calcApptInFloor = getApptInFloor(countAppt, countFloors);

  for (let i = 0; i < countFloors; i += 1) {
    listFloors[countFloors - i] = calcApptInFloor(i);
  }

  return listFloors;
};

const getItem = (count, countView, countFloors) => {
  return {
    count,
    countView,
    floors: getListApptInFloor(count, countFloors),
  };
};

const parseNok = (array, countFloors) => {
  return array.reduce((total, { NUM: porch, FLATS: numbers }) => {
    const [ from, to ] = numbers.split('-');
    const apt = (from && to) ? (+to - +from + 1) : 0;
    const aptView = (from && to) ? numbers : 0;

    total[porch] = getItem(apt, aptView, countFloors);

    return total;
  }, {});
}

export default (options) => {
  const { countPorches, countAppt, countFloors } = options;

  if (options.db) return parseNok(options.db, countFloors);

  const numbers = {};
  const calcApptInPorch = calcAppt(countAppt, countPorches);

  for (let i = 0; i < countPorches; i += 1) {
    numbers[i + 1] = getItem(calcApptInPorch(i), '', countFloors);
  }

  return numbers;
};
