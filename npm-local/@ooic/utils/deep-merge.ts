export const deepMerge = <T, S>(target: T, source: S): T & S => {
  const obj = target || {} as any;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];

      if (value instanceof Object && !Array.isArray(value)) {
        obj[key] = deepMerge<T, typeof value>(obj[key], value);
      } else {
        obj[key] = value;
      }
    }
  }

  return obj;
};
