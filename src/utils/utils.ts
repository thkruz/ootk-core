import * as Types from '../types/types';

class Utils {
  static Types = Types;

  static createVec(start: number, stop: number, step: number): number[] {
    const array = [];

    for (let i = start; i <= stop; i += step) {
      array.push(i);
    }

    return array;
  }
}

export { Utils };
