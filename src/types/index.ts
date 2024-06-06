import type {
  IBoxRaw,
  IBox,
  IBoxCoords,
  IBoxCoordsCalculate,
  BoxType,
  BoxTypeWithColor,
} from './box.types';
import type {
  IFloor,
  IFloorCoords,
  IFloorCoordsCalculate,
  FloorType,
} from './floor.types';
import type {
  IHouseRaw,
  IHouse,
  HouseType,
  HouseRoutingPosition,
  HouseBoxesPosition,
  HouseDirection,
} from './house.types';
import type {
  IPorchRaw,
  IPorch,
  IPorchCoords,
  IPorchCoordsCalculate,
} from './porch.types';
import type { IRiser, IRisers, IRiserOptions } from './riser.types';

export interface IOptions {
  house: IHouseRaw;
  box: IBoxRaw;
  porches: IPorchRaw[];
}

export {
  IBox,
  IBoxCoords,
  IBoxCoordsCalculate,
  BoxType,
  BoxTypeWithColor,
  IFloor,
  IFloorCoords,
  IFloorCoordsCalculate,
  FloorType,
  IHouse,
  HouseType,
  HouseRoutingPosition,
  HouseBoxesPosition,
  HouseDirection,
  IPorch,
  IPorchCoords,
  IPorchCoordsCalculate,
  IRiser,
  IRisers,
  IRiserOptions,
};
