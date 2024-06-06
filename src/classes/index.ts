import Scheme from './Scheme';
import { IOptions } from '../types';

export const calculateScheme = (options: IOptions) => {
  const scheme = new Scheme(options);
  scheme.calculate();
  return scheme;
};
