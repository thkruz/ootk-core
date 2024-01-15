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

// / Geocentric right-ascension and declination.
export class RadecGeocentric {
  // / Create a new [RadecGeocentric] object.
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
   * Create a new [RadecGeocentric] object, using degrees for the
   * angular values.
   * @param epoch UTC epoch.
   * @param rightAscensionDegrees Right-ascension _(°)_.
   * @param declinationDegrees Declination _(°)_.
   * @param range Range _(km)_.
   * @param rightAscensionRateDegrees Right-ascension rate _(°/s)_.
   * @param declinationRateDegrees Declination rate _(°/s)_.
   * @param rangeRate Range rate _(km/s)_.
   * @returns A new [RadecGeocentric] object.
   */
  static fromDegrees(
    epoch: EpochUTC,
    rightAscensionDegrees: number,
    declinationDegrees: number,
    range?: number,
    rightAscensionRateDegrees?: number,
    declinationRateDegrees?: number,
    rangeRate?: number,
  ): RadecGeocentric {
    const rightAscensionRate = rightAscensionRateDegrees && rightAscensionRateDegrees * DEG2RAD;
    const declinationRate = declinationRateDegrees && declinationRateDegrees * DEG2RAD;

    return new RadecGeocentric(
      epoch,
      rightAscensionDegrees * DEG2RAD,
      declinationDegrees * DEG2RAD,
      range,
      rightAscensionRate,
      declinationRate,
      rangeRate,
    );
  }

  // / Create a [RadecGeocentric] object from an inertial [state] vector.
  static fromStateVector(state: J2000): RadecGeocentric {
    const rI = state.position.x;
    const rJ = state.position.y;
    const rK = state.position.z;
    const vI = state.velocity.x;
    const vJ = state.velocity.y;
    const vK = state.velocity.z;
    const rMag = state.position.magnitude();
    const declination = Math.asin(rK / rMag);
    const rIJMag = Math.sqrt(rI * rI + rJ * rJ);
    let rightAscension;

    if (rIJMag !== 0) {
      rightAscension = Math.atan2(rJ, rI);
    } else {
      rightAscension = Math.atan2(vJ, vI);
    }
    const rangeRate = state.position.dot(state.velocity) / rMag;
    const rightAscensionRate = (vI * rJ - vJ * rI) / (-(rJ * rJ) - rI * rI);
    const declinationRate = (vK - rangeRate * (rK / rMag)) / rIJMag;

    return new RadecGeocentric(
      state.epoch,
      rightAscension % TAU,
      declination,
      rMag,
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
   * Return the position relative to the center of the Earth.
   *
   * An optional [range] _(km)_ value can be passed to override the value
   * contained in this observation.
   * @param range Range _(km)_.
   * @returns A [Vector3D] object.
   */
  position(range?: number): Vector3D {
    const r = range ?? this.range ?? 1.0;

    return radecToPosition(this.rightAscension, this.declination, r);
  }

  /**
   * Return the velocity relative to the centar of the Earth.
   *
   * An optional [range] _(km)_ and [rangeRate] _(km/s)_ value can be passed
   * to override the value contained in this observation.
   * @param range Range _(km)_.
   * @param rangeRate Range rate _(km/s)_.
   * @returns A [Vector3D] object.
   */
  velocity(range?: number, rangeRate?: number): Vector3D {
    if (!this.rightAscensionRate || !this.declinationRate) {
      throw new Error('Velocity unsolvable, missing ra/dec rates.');
    }
    const r = range ?? this.range ?? 1.0;
    const rd = rangeRate ?? this.rangeRate ?? 0.0;

    return radecToVelocity(this.rightAscension, this.declination, r, this.rightAscensionRate, this.declinationRate, rd);
  }

  /**
   * Calculate the angular distance _(rad)_ between this and another
   * [RadecGeocentric] object.
   * @param radec - The other [RadecGeocentric] object.
   * @param method - The angular distance method to use.
   * @returns The angular distance _(rad)_.
   */
  angle(radec: RadecGeocentric, method: AngularDistanceMethod = AngularDistanceMethod.Cosine): number {
    return angularDistance(this.rightAscension, this.declination, radec.rightAscension, radec.declination, method);
  }

  /**
   * Calculate the angular distance _(°)_ between this and another
   * [RadecGeocentric] object.
   * @param radec - The other [RadecGeocentric] object.
   * @param method - The angular distance method to use.
   * @returns The angular distance _(°)_.
   */
  angleDegrees(radec: RadecGeocentric, method: AngularDistanceMethod = AngularDistanceMethod.Cosine): number {
    return this.angle(radec, method) * RAD2DEG;
  }
}
