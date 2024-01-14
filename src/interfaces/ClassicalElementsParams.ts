import { Kilometers, Radians } from 'src/main';
import { EpochUTC } from '../time/EpochUTC';

export interface ClassicalElementsParams {
  epoch: EpochUTC;
  semimajorAxis: Kilometers;
  eccentricity: number;
  inclination: Radians;
  rightAscension: Radians;
  argPerigee: Radians;
  trueAnomaly: Radians;
  mu?: number;
}
