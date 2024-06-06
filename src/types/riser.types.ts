export interface IRiserOptions {
  internet: boolean;
  ktv: boolean;
  ktvCount: number;
}

export interface IRiser extends IRiserOptions {
  id: string;
  get visible(): boolean;
  get sizes(): any;
}

export interface IRisers {
  list: IRiser[];
  changeRise(index: number, options: IRiserOptions): void;
  get visibleInternet(): boolean;
  get visibleKtv(): boolean;
  get ktvCount(): number;
}
