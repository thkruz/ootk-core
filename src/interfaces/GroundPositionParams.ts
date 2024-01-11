import { Degrees, Kilometers } from './../types/types';

export interface GroundPositionParams {
  name?: string;
  lat: Degrees;
  lon: Degrees;
  alt: Kilometers;
}
