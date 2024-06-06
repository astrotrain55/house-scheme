import type { IBox, IBoxCoords, IBoxCoordsCalculate } from './box.types';
import type { IPorch } from './porch.types';

export type FloorType = 'tech' | 'default';

type FloorSizes = { width: number; height: number };

export interface IFloor {
  id: string;
  name: string;
  type: FloorType;
  visible: boolean;
  entity: boolean;
  moving: boolean;
  tower: boolean;
  appt: number;
  boxes: IBox[];
  porch: IPorch;
  color: string;
  get sizes(): FloorSizes;
  toggle(): void;
  toggleEntity(): void;
  setAppt(count: number): void;
  setColor(color: string): void;
}

export interface IFloorCoords {
  ess: IFloor;
  sizes: FloorSizes;
  tower: boolean;
  boxes: IBoxCoords[];
}

export interface IFloorCoordsCalculate {
  ess: IFloor;
  boxes: IBoxCoordsCalculate[];
  coords: { top: number; left: number; right: number; bottom: number };
  points: number[][];
}
