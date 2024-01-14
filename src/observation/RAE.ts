/* eslint-disable no-undefined */
import { ITRF } from '../coordinate/ITRF';
import { J2000 } from '../coordinate/J2000';
import { AngularDistanceMethod } from '../enums/AngularDistanceMethod';
import { Degrees, Kilometers, Radians } from '../main';
import { Vector3D } from '../operations/Vector3D';
import { EpochUTC } from '../time/EpochUTC';
import { DEG2RAD, halfPi, RAD2DEG, TAU } from '../utils/constants';
import { angularDistance } from '../utils/functions';

// / Range, azimuth, and elevation.
export class RAE {
  // / Create a new [Razel] object.
  constructor(
    public epoch: EpochUTC,
    public range: Kilometers,
    public azimuth: Radians,
    public elevation: Radians,
    /**
     * The range rate of the satellite relative to the observer in kilometers
     * per second.
     */
    public rangeRate?: number,
    /**
     * The azimuth rate of the satellite relative to the observer in radians per
     * second.
     */
    public azimuthRate?: number,
    /**
     * The elevation rate of the satellite relative to the observer in radians
     * per second.
     */
    public elevationRate?: number,
  ) {
    // Do nothing
  }

  // / Create a new [Razel] object, using degrees for the angular values.
  static fromDegrees(
    epoch: EpochUTC,
    range: Kilometers,
    azimuthDegrees: Degrees,
    elevationDegrees: Degrees,
    rangeRate?: number,
    azimuthRateDegrees?: number,
    elevationRateDegrees?: number,
  ): RAE {
    const azimuthRate = azimuthRateDegrees ? azimuthRateDegrees * DEG2RAD : undefined;
    const elevationRate = elevationRateDegrees ? elevationRateDegrees * DEG2RAD : undefined;

    return new RAE(
      epoch,
      range,
      (azimuthDegrees * DEG2RAD) as Radians,
      (elevationDegrees * DEG2RAD) as Radians,
      rangeRate,
      azimuthRate,
      elevationRate,
    );
  }

  /**
   * Create a [Razel] object from an inertial [state] and [site] vector.
   */
  static fromStateVectors(state: J2000, site: J2000): RAE {
    const stateEcef = state.toITRF();
    const siteEcef = site.toITRF();
    const po2 = halfPi;
    const r = stateEcef.position.subtract(siteEcef.position);
    const rDot = stateEcef.velocity;
    const geo = siteEcef.toGeodetic();
    const p = r.rotZ(geo.lon).rotY((po2 - geo.lat) as Radians);
    const pDot = rDot.rotZ(geo.lon).rotY((po2 - geo.lat) as Radians);
    const pS = p.x;
    const pE = p.y;
    const pZ = p.z;
    const pSDot = pDot.x;
    const pEDot = pDot.y;
    const pZDot = pDot.z;
    const pMag = p.magnitude();
    const pSEMag = Math.sqrt(pS * pS + pE * pE);
    const elevation = Math.asin(pZ / pMag);
    let azimuth;

    if (elevation !== po2) {
      azimuth = Math.atan2(-pE, pS) + Math.PI;
    } else {
      azimuth = Math.atan2(-pEDot, pSDot) + Math.PI;
    }
    const rangeRate = p.dot(pDot) / pMag;
    const azimuthRate = (pSDot * pE - pEDot * pS) / (pS * pS + pE * pE);
    const elevationRate = (pZDot - rangeRate * Math.sin(elevation)) / pSEMag;

    return new RAE(
      state.epoch,
      pMag,
      (azimuth % TAU) as Radians,
      elevation as Radians,
      rangeRate,
      azimuthRate,
      elevationRate,
    );
  }
  // / Azimuth _(°)_.
  get azimuthDegrees(): number {
    return this.azimuth * RAD2DEG;
  }

  // / Elevation _(°)_.
  get elevationDegrees(): number {
    return this.elevation * RAD2DEG;
  }

  // / Azimuth rate _(°/s)_.
  get azimuthRateDegrees(): number | undefined {
    return this.azimuthRate ? this.azimuthRate * RAD2DEG : undefined;
  }

  // / Elevation rate _(°/s)_.
  get elevationRateDegrees(): number | undefined {
    return this.elevationRate ? this.elevationRate * RAD2DEG : undefined;
  }

  toString(): string {
    return [
      '[RazEl]',
      `  Epoch:     ${this.epoch}`,
      `  Azimuth:   ${this.azimuthDegrees.toFixed(4)}°`,
      `  Elevation: ${this.elevationDegrees.toFixed(4)}°`,
      `  Range:     ${this.range.toFixed(3)} km`,
    ].join('\n');
  }

  /**
   * Return the position relative to the observer [site].
   *
   * An optional azimuth [az] _(rad)_ and elevation [el] _(rad)_ value can be
   * passed to override the values contained in this observation.
   */
  position(site: J2000, az?: Radians, el?: Radians): Vector3D<Kilometers> {
    const ecef = site.toITRF();
    const geo = ecef.toGeodetic();
    const po2 = halfPi;
    const newAz = az ?? this.azimuth;
    const newEl = el ?? this.elevation;
    const sAz = Math.sin(newAz);
    const cAz = Math.cos(newAz);
    const sEl = Math.sin(newEl);
    const cEl = Math.cos(newEl);
    const pSez = new Vector3D<Kilometers>(
      (-this.range * cEl * cAz) as Kilometers,
      (this.range * cEl * sAz) as Kilometers,
      (this.range * sEl) as Kilometers,
    );
    const rEcef = pSez
      .rotY(-(po2 - geo.lat) as Radians)
      .rotZ(-geo.lon as Radians)
      .add(ecef.position);

    return new ITRF(this.epoch, rEcef, Vector3D.origin as Vector3D<Kilometers>).toJ2000().position;
  }

  /**
   * Convert this observation into a [J2000] state vector.
   *
   * This will throw an error if the [rangeRate], [elevationRate], or
   * [azimuthRate] are not defined.
   */
  toStateVector(site: J2000): J2000 {
    if (!this.rangeRate || !this.elevationRate || !this.azimuthRate) {
      throw new Error('Cannot create state, required values are undefined.');
    }
    const ecef = site.toITRF();
    const geo = ecef.toGeodetic();
    const po2 = halfPi;
    const sAz = Math.sin(this.azimuth);
    const cAz = Math.cos(this.azimuth);
    const sEl = Math.sin(this.elevation);
    const cEl = Math.cos(this.elevation);
    const pSez = new Vector3D<Kilometers>(
      (-this.range * cEl * cAz) as Kilometers,
      (this.range * cEl * sAz) as Kilometers,
      (this.range * sEl) as Kilometers,
    );
    const pDotSez = new Vector3D<Kilometers>(
      (-this.rangeRate * cEl * cAz +
        this.range * sEl * cAz * this.elevationRate +
        this.range * cEl * sAz * this.azimuthRate) as Kilometers,
      (this.rangeRate * cEl * sAz -
        this.range * sEl * sAz * this.elevationRate +
        this.range * cEl * cAz * this.azimuthRate) as Kilometers,
      (this.rangeRate * sEl + this.range * cEl * this.elevationRate) as Kilometers,
    );
    const pEcef = pSez.rotY(-(po2 - geo.lat) as Radians).rotZ(-geo.lon as Radians);
    const pDotEcef = pDotSez.rotY(-(po2 - geo.lat) as Radians).rotZ(-geo.lon as Radians);
    const rEcef = pEcef.add(ecef.position);

    return new ITRF(this.epoch, rEcef, pDotEcef).toJ2000();
  }

  /**
   * Calculate the angular distance _(rad)_ between this and another [Razel]
   * object.
   */
  angle(razel: RAE, method: AngularDistanceMethod = AngularDistanceMethod.Cosine): number {
    return angularDistance(this.azimuth, this.elevation, razel.azimuth, razel.elevation, method);
  }

  /**
   * Calculate the angular distance _(°)_ between this and another [Razel]
   * object.
   */
  angleDegrees(razel: RAE, method: AngularDistanceMethod = AngularDistanceMethod.Cosine): number {
    return this.angle(razel, method) * RAD2DEG;
  }
}
