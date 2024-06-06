interface IInitParams {
  countPorches: number;
  countAppt: number;
  countFloors: number;
  db: any[];
}

export interface IItem {
  count: number;
  countView: string;
  floors: Record<string, number>;
}

export type INumbers = Record<string, IItem>;

const calcAppt = (countAppt: number, countPorches: number) => {
  // делим все квартиры на количество подъездов
  const apptInPorch = Math.floor(countAppt / countPorches);
  // если не делится то вычисляем остаток
  const balancePorch = countAppt - apptInPorch * countPorches;

  return (indexPorch: number) =>
    indexPorch === 0 ? apptInPorch + balancePorch : apptInPorch;
};

const getApptInFloor = (apptInPorch: number, countFloors: number) => {
  const apptResult = Math.floor(apptInPorch / countFloors);
  const remainder = countFloors - (apptInPorch % countFloors);
  const result: number[] = [];

  for (let i = countFloors; i > 0; i -= 1) {
    result.unshift(i > remainder ? apptResult + 1 : apptResult);
  }

  return (indexFloor: number) => result[indexFloor];
};

const getListApptInFloor = (countAppt: number, countFloors: number) => {
  const listFloors: Record<string, number> = {};
  const calcApptInFloor = getApptInFloor(countAppt, countFloors);

  for (let i = 0; i < countFloors; i += 1) {
    listFloors[countFloors - i] = calcApptInFloor(i);
  }

  return listFloors;
};

const getItem = (
  count: number,
  countView: string,
  countFloors: number,
): IItem => ({
  count,
  countView,
  floors: getListApptInFloor(count, countFloors),
});

const parseNok = (array: any[], countFloors: number) =>
  array.reduce((total, { NUM: porch, FLATS: numbers }) => {
    const [from, to] = numbers.split('-');
    const apt = from && to ? +to - +from + 1 : 0;
    const aptView = from && to ? numbers : 0;

    total[porch] = getItem(apt, aptView, countFloors);

    return total;
  }, {});

export default (options: IInitParams): INumbers => {
  const { countPorches, countAppt, countFloors } = options;

  if (options.db.length) return parseNok(options.db, countFloors);

  const numbers: INumbers = {};
  const calcApptInPorch = calcAppt(countAppt, countPorches);

  for (let i = 0; i < countPorches; i += 1) {
    numbers[i + 1] = getItem(calcApptInPorch(i), '', countFloors);
  }

  return numbers;
};
