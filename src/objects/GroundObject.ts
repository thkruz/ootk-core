import {
  GroundPositionParams,
  Degrees,
  EcfVec3,
  EciVec3,
  Kilometers,
  LlaVec3,
  Radians,
  RaeVec3,
  calcGmst,
  lla2eci,
  llaRad2ecf,
  DEG2RAD,
  Geodetic,
} from '../main';

import { BaseObject } from './BaseObject';
import { Satellite } from './Satellite';

export class GroundObject extends BaseObject {
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

  /**
   * Calculates the relative azimuth, elevation, and range between this
   * GroundObject and a Satellite.
   * @param satellite The Satellite object. @param date The date for which to
   * calculate the RAE values. Defaults to the current date. @returns The
   * relative azimuth, elevation, and range values in kilometers and degrees.
   */
  rae(satellite: Satellite, date: Date = new Date()): RaeVec3<Kilometers, Degrees> {
    return satellite.rae(this, date);
  }

  /**
   * Calculates ECF position at a given time.
   *
   * @optimized version of this.toGeodetic().toITRF().position;
   */
  ecf(): EcfVec3<Kilometers> {
    return llaRad2ecf(this.toGeodetic());
  }

  /**
   * Calculates the Earth-Centered Inertial (ECI) position vector of the ground
   * object at a given date.
   *
   * @optimzed version of this.toGeodetic().toITRF().toJ2000().position;
   *
   * @param date The date for which to calculate the ECI position vector.
   * Defaults to the current date.
   *
   * @returns The ECI position vector of the ground object.
   */
  eci(date: Date = new Date()): EciVec3<Kilometers> {
    const { gmst } = calcGmst(date);

    return lla2eci(this.toGeodetic(), gmst);
  }

  /**
   * Converts the latitude, longitude, and altitude of the GroundObject to
   * radians and kilometers.
   *
   * @optimized version of this.toGeodetic() without class instantiation for
   * better performance and serialization.
   *
   * @returns An object containing the latitude, longitude, and altitude in
   * radians and kilometers.
   */
  llaRad(): LlaVec3<Radians, Kilometers> {
    return {
      lat: (this.lat * DEG2RAD) as Radians,
      lon: (this.lon * DEG2RAD) as Radians,
      alt: this.alt,
    };
  }

  /**
   * Creates a GroundObject object from a Geodetic position.
   *
   * @param geodetic The geodetic coordinates.
   * @returns A new GroundObject object.
   */
  static fromGeodetic(geodetic: Geodetic): GroundObject {
    return new GroundObject({
      lat: geodetic.latDeg as Degrees,
      lon: geodetic.lonDeg as Degrees,
      alt: geodetic.alt,
    });
  }

  /**
   * Converts the ground position to geodetic coordinates.
   * @returns The geodetic coordinates.
   */
  toGeodetic(): Geodetic {
    return Geodetic.fromDegrees(this.lat, this.lon, this.alt);
  }

  /**
   * Validates the input data for the GroundObject.
   * @param info - The GroundPositionParams object containing the latitude,
   * longitude, and altitude. @returns void
   */
  private validateInputData_(info: GroundPositionParams) {
    this.validateParameter_(info.lat, -90, 90, 'Invalid latitude - must be between -90 and 90');
    this.validateParameter_(info.lon, -180, 180, 'Invalid longitude - must be between -180 and 180');
    this.validateParameter_(info.alt, 0, null, 'Invalid altitude - must be greater than 0');
  }

  /**
   * Validates a parameter value against a minimum and maximum value.
   * @template T - The type of the parameter value. @param value - The parameter
   * value to validate. @param minValue - The minimum allowed value. If not
   * provided, no minimum value check will be performed. @param maxValue - The
   * maximum allowed value. If not provided, no maximum value check will be
   * performed. @param errorMessage - The error message to throw if the value is
   * outside the allowed range. @throws {Error} - Throws an error with the
   * specified error message if the value is outside the allowed range.
   */
  private validateParameter_<T>(value: T, minValue: T, maxValue: T, errorMessage: string): void {
    if (minValue && value < minValue) {
      throw new Error(errorMessage);
    }
    if (maxValue && value > maxValue) {
      throw new Error(errorMessage);
    }
  }
}
