/**
 * @author Theodore Kruczek.
 * @license MIT
 * @copyright (c) 2022-2025 Theodore Kruczek Permission is
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

import { Minutes, PositionVelocity, Kilometers, Radians, Seconds } from '../main.js';
import { EpochUTC } from '../time/EpochUTC.js';
import { earthGravityParam, MINUTES_PER_DAY, TAU } from '../utils/constants.js';
import { newtonM } from '../utils/functions.js';
import { ClassicalElements } from './ClassicalElements.js';
import { EquinoctialElementsParams } from '../interfaces/EquinoctialElementsParams.js';

/**
 * Equinoctial elements are a set of orbital elements used to describe the
 * orbits of celestial bodies, such as satellites around a planet. They provide
 * an alternative to the traditional Keplerian elements and are especially
 * useful for avoiding singularities and numerical issues in certain types of
 * orbits.
 *
 * Unlike Keplerian elements, equinoctial elements don't suffer from
 * singularities at zero eccentricity (circular orbits) or zero inclination
 * (equatorial orbits). This makes them more reliable for numerical simulations
 * and analytical studies, especially in these edge cases.
 * @see https://faculty.nps.edu/dad/orbital/th0.pdf
 */
export class EquinoctialElements {
  epoch: EpochUTC;
  /** The semi-major axis of the orbit in kilometers. */
  a: Kilometers;
  /** The h component of the eccentricity vector. */
  h: number;
  /** The k component of the eccentricity vector. */
  k: number;
  /** The p component of the ascending node vector. */
  p: number;
  /** The q component of the ascending node vector. */
  q: number;
  /** The mean longitude of the orbit in radians. */
  lambda: Radians;
  /** The gravitational parameter of the central body in km³/s². */
  mu: number;
  /** The retrograde factor. 1 for prograde orbits, -1 for retrograde orbits. */
  I: 1 | -1;
  constructor({ epoch, h, k, lambda, a, p, q, mu, I }: EquinoctialElementsParams) {
    this.epoch = epoch;
    this.h = h;
    this.k = k;
    this.lambda = lambda;
    this.a = a;
    this.p = p;
    this.q = q;
    this.mu = mu ?? earthGravityParam;
    this.I = I ?? 1;
  }

  /**
   * Returns a string representation of the EquinoctialElements object.
   * @returns A string representation of the EquinoctialElements object.
   */
  toString(): string {
    return [
      '[EquinoctialElements]',
      `  Epoch: ${this.epoch}`,
      `  a: ${this.a} km`,
      `  h: ${this.h}`,
      `  k: ${this.k}`,
      `  p: ${this.p}`,
      `  q: ${this.q}`,
      `  lambda: ${this.lambda} rad`,
    ].join('\n');
  }

  /**
   * Gets the semimajor axis.
   * @returns The semimajor axis in kilometers.
   */
  get semimajorAxis(): Kilometers {
    return this.a;
  }

  /**
   * Gets the mean longitude.
   * @returns The mean longitude in radians.
   */
  get meanLongitude(): Radians {
    return this.lambda;
  }

  /**
   * Calculates the mean motion of the celestial object.
   * @returns The mean motion in units of radians per second.
   */
  get meanMotion(): number {
    return Math.sqrt(this.mu / this.a ** 3);
  }

  /**
   * Gets the retrograde factor.
   * @returns The retrograde factor.
   */
  get retrogradeFactor(): number {
    return this.I;
  }

  /**
   * Checks if the orbit is prograde.
   * @returns True if the orbit is prograde, false otherwise.
   */
  isPrograde(): boolean {
    return this.I === 1;
  }

  /**
   * Checks if the orbit is retrograde.
   * @returns True if the orbit is retrograde, false otherwise.
   */
  isRetrograde(): boolean {
    return this.I === -1;
  }

  /**
   * Gets the period of the orbit.
   * @returns The period in minutes.
   */
  get period(): Minutes {
    const periodSec = (TAU * Math.sqrt(this.semimajorAxis ** 3 / this.mu)) as Seconds;

    return (periodSec / 60) as Minutes;
  }

  /**
   * Gets the number of revolutions per day.
   * @returns The number of revolutions per day.
   */
  get revsPerDay(): number {
    return MINUTES_PER_DAY / this.period;
  }

  /**
   * Converts the equinoctial elements to classical elements.
   * @returns The classical elements.
   */
  toClassicalElements(): ClassicalElements {
    const a = this.semimajorAxis;
    const e = Math.sqrt(this.k * this.k + this.h * this.h);
    const i = Math.PI * ((1.0 - this.I) * 0.5) + 2.0 * this.I * Math.atan(Math.sqrt(this.p * this.p + this.q * this.q));
    const o = Math.atan2(this.p, this.q);
    const w = Math.atan2(this.h, this.k) - this.I * Math.atan2(this.p, this.q);
    const m = this.lambda - this.I * o - w;
    const v = newtonM(e, m).nu;

    return new ClassicalElements({
      epoch: this.epoch,
      semimajorAxis: a,
      eccentricity: e,
      inclination: i as Radians,
      rightAscension: o as Radians,
      argPerigee: w as Radians,
      trueAnomaly: v as Radians,
      mu: this.mu,
    });
  }

  /**
   * Converts the equinoctial elements to position and velocity.
   * @returns The position and velocity in classical elements.
   */
  toPositionVelocity(): PositionVelocity {
    return this.toClassicalElements().toPositionVelocity();
  }
}
