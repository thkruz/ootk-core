import { Kilometers, Radians } from 'src/main';
import { EpochUTC } from '../time/EpochUTC';

export interface EquinoctialElementsParams {
  epoch: EpochUTC;
  h: number;
  k: number;
  lambda: Radians;
  a: Kilometers;
  p: number;
  q: number;
  mu?: number;
  /**
   * Retrograde factor. 1 for prograde orbits, -1 for retrograde orbits.
   */
  I?: 1 | -1;
}
