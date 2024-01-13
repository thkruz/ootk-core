import { calcGmst, lla2eci, llaRad2ecf } from '../transforms';
import { Degrees, EcfVec3, EciVec3, Kilometers, LlaVec3, Radians, RaeVec3 } from '../types/types';
import { DEG2RAD } from '../utils/constants';
import { GroundPositionParams } from './../interfaces/GroundPositionParams';

import { BaseObject } from './BaseObject';
import { Satellite } from './Satellite';

export class GroundPosition extends BaseObject {
  name = 'Unknown Ground Position';
  lat: Degrees;
  lon: Degrees;
  alt: Kilometers;

  constructor(info: GroundPositionParams) {
    super(info);

    this.validateInputData_(info);
    this.lat = info.lat;
    this.lon = info.lon;
    this.alt = info.alt;
  }

  isSensor(): boolean {
    return false;
  }

  rae(sat: Satellite, date: Date = this.time): RaeVec3<Kilometers, Degrees> {
    return sat.raeOpt(this, date);
  }

  /**
   * Calculates ECF position at a given time.
   *
   * @optimized
   */
  ecf(): EcfVec3<Kilometers> {
    return llaRad2ecf(this.llaRad());
  }

  eci(date: Date = this.time): EciVec3<Kilometers> {
    const { gmst } = calcGmst(date);

    return lla2eci(this.llaRad(), gmst);
  }

  setTime(date: Date): this {
    this.time = date;

    return this;
  }

  llaRad(): LlaVec3<Radians, Kilometers> {
    return {
      lat: (this.lat * DEG2RAD) as Radians,
      lon: (this.lon * DEG2RAD) as Radians,
      alt: this.alt,
    };
  }

  private validateInputData_(info: GroundPositionParams) {
    this.validateParameter_(info.lat, -90, 90, 'Invalid latitude - must be between -90 and 90');
    this.validateParameter_(info.lon, -180, 180, 'Invalid longitude - must be between -180 and 180');
    this.validateParameter_(info.alt, 0, null, 'Invalid altitude - must be greater than 0');
  }

  private validateParameter_<T>(value: T, minValue: T, maxValue: T, errorMessage: string): void {
    if (minValue && value < minValue) {
      throw new Error(errorMessage);
    }
    if (maxValue && value > maxValue) {
      throw new Error(errorMessage);
    }
  }
}
