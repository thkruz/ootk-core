import { Degrees, Kilometers, SpaceObjectType } from '../types/types';

export interface SensorParams {
  alt: Kilometers;
  lat: Degrees;
  lon: Degrees;
  maxAz: Degrees;
  maxAz2?: Degrees;
  maxEl: Degrees;
  maxEl2?: Degrees;
  maxRng: Kilometers;
  maxRng2?: Kilometers;
  minAz: Degrees;
  minAz2?: Degrees;
  minEl: Degrees;
  minEl2?: Degrees;
  minRng: Kilometers;
  minRng2?: Kilometers;
  name?: string;
  type?: SpaceObjectType;
}
