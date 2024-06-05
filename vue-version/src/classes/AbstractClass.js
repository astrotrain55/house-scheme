export default class AbstractClass {
  constructor(options) {
    const params = {
      ...this.defaultOptions,
      ...options,
    };

    Object.keys(params).forEach((key) => {
      this[key] = params[key];
    });
  }

  get defaultOptions() {
    return new Error('not found getter defaultOptions');
  }
}
