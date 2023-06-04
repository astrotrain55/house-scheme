import Scheme from './Scheme';

function calculateScheme(options) {
  const scheme = new Scheme(options);
  scheme.calculate();
  return scheme;
}

export { calculateScheme };
