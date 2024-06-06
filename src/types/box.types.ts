import type { IFloor } from './floor.types';

export interface IBoxRaw {
  UF_XML_ID: string;
  UF_PORCH_ID: string;
  UF_BOX_PLACEMENT: string;
  UF_BOX_TYPE: string;
}

export type BoxType = '3' | '8';

export type BoxTypeWithColor = {
  type: string;
  internet: number;
  ktv: number;
  color?: string;
};

type BoxSizes = { width: number; height: number };

export interface IBox {
  id: string;
  type: BoxType;
  name: string;
  origin: boolean;
  receiverCount: number;
  floors: IFloor[];
  get sizes(): BoxSizes;
  setReceiverCount(count: number): void;
}

export interface IBoxCoords {
  ess: IBox;
  sizes: BoxSizes;
}

export interface IBoxCoordsCalculate {
  ess: IBox;
  coords: { top: number; left: number; right: number; bottom: number };
  points: { x: number; y: number; width: number; height: number };
}
