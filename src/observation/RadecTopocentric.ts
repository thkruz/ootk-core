/**
 * @author Theodore Kruczek.
 * @license MIT
 * @copyright (c) 2022-2024 Theodore Kruczek Permission is
 * hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-disable no-undefined */
import { J2000 } from '../coordinate/J2000';
import { AngularDistanceMethod } from '../enums/AngularDistanceMethod';
import { Vector3D } from '../operations/Vector3D';
import { EpochUTC } from '../time/EpochUTC';
import { DEG2RAD, RAD2DEG, TAU } from '../utils/constants';
import { angularDistance } from '../utils/functions';
import { radecToPosition, radecToVelocity } from './ObservationUtils';

// / Topocentric right-ascension and declination.
export class RadecTopocentric {
  // / Create a new [RadecTopocentric] object.
  constructor(
    public epoch: EpochUTC,
    public rightAscension: number,
    public declination: number,
    public range?: number,
    public rightAscensionRate?: number,
    public declinationRate?: number,
    public rangeRate?: number,
  ) {
    // Nothing to do here.
  }

  /**
   * Create a new [RadecTopocentric] object, using degrees for the
   * angular values.
   * @param epoch UTC epoch.
   * @param rightAscensionDegrees Right-ascension _(°)_.
   * @param declinationDegrees Declination _(°)_.
   * @param range Range _(km)_.
   * @param rightAscensionRateDegrees Right-ascension rate _(°/s)_.
   * @param declinationRateDegrees Declination rate _(°/s)_.
   * @param rangeRate Range rate _(km/s)_.
   * @returns A new [RadecTopocentric] object.
   */
  static fromDegrees(
    epoch: EpochUTC,
    rightAscensionDegrees: number,
    declinationDegrees: number,
    range?: number,
    rightAscensionRateDegrees?: number,
    declinationRateDegrees?: number,
    rangeRate?: number,
  ): RadecTopocentric {
    const rightAscensionRate = rightAscensionRateDegrees ? rightAscensionRateDegrees * DEG2RAD : undefined;
    const declinationRate = declinationRateDegrees ? declinationRateDegrees * DEG2RAD : undefined;

    return new RadecTopocentric(
      epoch,
      rightAscensionDegrees * DEG2RAD,
      declinationDegrees * DEG2RAD,
      range,
      rightAscensionRate,
      declinationRate,
      rangeRate,
    );
  }

  /**
   * Create a [RadecTopocentric] object from an inertial [state] and
   * [site] vector.
   * @param state Inertial state vector.
   * @param site Site vector.
   * @returns A new [RadecTopocentric] object.
   */
  static fromStateVectors(state: J2000, site: J2000): RadecTopocentric {
    const p = state.position.subtract(site.position);
    const pI = p.x;
    const pJ = p.y;
    const pK = p.z;
    const pMag = p.magnitude();
    const declination = Math.asin(pK / pMag);
    const pDot = state.velocity.subtract(site.velocity);
    const pIDot = pDot.x;
    const pJDot = pDot.y;
    const pKDot = pDot.z;
    const pIJMag = Math.sqrt(pI * pI + pJ * pJ);
    let rightAscension;

    if (pIJMag !== 0) {
      rightAscension = Math.atan2(pJ, pI);
    } else {
      rightAscension = Math.atan2(pJDot, pIDot);
    }
    const rangeRate = p.dot(pDot) / pMag;
    const rightAscensionRate = (pIDot * pJ - pJDot * pI) / (-(pJ * pJ) - pI * pI);
    const declinationRate = (pKDot - rangeRate * Math.sin(declination)) / pIJMag;

    return new RadecTopocentric(
      state.epoch,
      rightAscension % TAU,
      declination,
      pMag,
      rightAscensionRate,
      declinationRate,
      rangeRate,
    );
  }

  // / Right-ascension _(°)_.
  get rightAscensionDegrees(): number {
    return this.rightAscension * RAD2DEG;
  }

  // / Declination _(°)_.
  get declinationDegrees(): number {
    return this.declination * RAD2DEG;
  }

  // / Right-ascension rate _(°/s)_.
  get rightAscensionRateDegrees(): number | undefined {
    return this.rightAscensionRate ? this.rightAscensionRate * RAD2DEG : undefined;
  }

  // / Declination rate _(°/s)_.
  get declinationRateDegrees(): number | undefined {
    return this.declinationRate ? this.declinationRate * RAD2DEG : undefined;
  }

  /**
   * Return the position relative to the observer [site].
   *
   * An optional [range] _(km)_ value can be passed to override the value
   * contained in this observation.
   * @param site Observer site.
   * @param range Range _(km)_.
   * @returns A [Vector3D] object.
   */
  position(site: J2000, range?: number): Vector3D {
    const r = range ?? this.range ?? 1.0;

    return radecToPosition(this.rightAscension, this.declination, r).add(site.position);
  }

  /**
   * Return the velocity relative to the observer [site].
   *
   * An optional [range] _(km)_ and [rangeRate] _(km/s)_ value can be passed
   * to override the values contained in this observation.
   * @param site Observer site.
   * @param range Range _(km)_.
   * @param rangeRate Range rate _(km/s)_.
   * @returns A [Vector3D] object.
   */
  velocity(site: J2000, range?: number, rangeRate?: number): Vector3D {
    if (!this.rightAscensionRate || !this.declinationRate) {
      throw new Error('Velocity unsolvable, missing ra/dec rates.');
    }
    const r = range ?? this.range ?? 1.0;
    const rd = rangeRate ?? this.rangeRate ?? 0.0;

    return radecToVelocity(
      this.rightAscension,
      this.declination,
      r,
      this.rightAscensionRate,
      this.declinationRate,
      rd,
    ).add(site.velocity);
  }

  // / Convert this observation into a line-of-sight vector.
  lineOfSight(): Vector3D {
    const ca = Math.cos(this.rightAscension);
    const cd = Math.cos(this.declination);
    const sa = Math.sin(this.rightAscension);
    const sd = Math.sin(this.declination);

    return new Vector3D(cd * ca, cd * sa, sd);
  }

  /**
   * Calculate the angular distance _(rad)_ between this and another
   * [RadecTopocentric] object.
   * @param radec - The other [RadecTopocentric] object.
   * @param method - The angular distance method to use.
   * @returns The angular distance _(rad)_.
   */
  angle(radec: RadecTopocentric, method: AngularDistanceMethod = AngularDistanceMethod.Cosine): number {
    return angularDistance(this.rightAscension, this.declination, radec.rightAscension, radec.declination, method);
  }

  /**
   * Calculate the angular distance _(°)_ between this and another
   * [RadecTopocentric] object.
   * @param radec - The other [RadecTopocentric] object.
   * @param method - The angular distance method to use.
   * @returns The angular distance _(°)_.
   */
  angleDegrees(radec: RadecTopocentric, method: AngularDistanceMethod = AngularDistanceMethod.Cosine): number {
    return this.angle(radec, method) * RAD2DEG;
  }
}
