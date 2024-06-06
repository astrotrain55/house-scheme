import type {
  IFloor,
  IFloorCoords,
  IFloorCoordsCalculate,
} from './floor.types';
import type { IRisers } from './riser.types';
import type { IHouse } from './house.types';

export interface IPorchRaw {
  UF_XML_ID: string;
  UF_NUMBER: string;
  UF_UPPER: string;
  UF_LOFT: string;
  UF_TECH: string;
  UF_GROUND: string;
  UF_BASEMENT: string;
}

type PorchSizes = { width: number; height: number };

export interface IPorch {
  id: string;
  name: string;
  visible: boolean;
  visibleCaption: boolean;
  offset: number;
  appt: number;
  house: IHouse;
  risers: IRisers;
  floors: IFloor[];
  get sizes(): PorchSizes;
  get isTower(): boolean;
  visibleAll(): boolean;
  debug(): boolean;
  setFloors(floors: IFloor[]): void;
  changeOffset(offset: number): void;
  toggle(): void;
}

export interface IPorchCoords {
  ess: IPorch;
  sizes: PorchSizes;
  offset: number;
  isTower: boolean;
  floors: IFloorCoords[];
}

export interface IPorchCoordsCalculate {
  ess: IPorch;
  floors: IFloorCoordsCalculate[];
  coords: { top: number; left: number; right: number; bottom: number };
  points: number[][];
}
