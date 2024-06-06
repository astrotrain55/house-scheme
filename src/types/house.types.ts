export interface IHouseRaw {
  UF_XML_ID: string;
  UF_APT_NUMBERS: { NUM: string; FLATS: string }[];
  UF_APPT_NUM: string;
  UF_FLOORS: string;
  UF_PODJEZD_NUM: string;
}

export type HouseType = 'low' | 'normal' | 'high';
export type HouseRoutingPosition = 'top' | 'bottom';
export type HouseDirection = 'left' | 'right';
export type HouseBoxesPosition = 'default' | 'tech';

export interface IHouse {
  id: string;
  nok: boolean;
  type: HouseType;
  routingPosition: HouseRoutingPosition;
  directionCalculation: HouseDirection;
  boxesPosition: HouseBoxesPosition;
  visibleAll: boolean;
  debug: boolean;
}
