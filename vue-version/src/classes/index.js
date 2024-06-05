import Scheme from './Scheme';

export const calculateScheme = (options) => {
  const scheme = new Scheme(options);
  scheme.calculate();
  return scheme;
};
