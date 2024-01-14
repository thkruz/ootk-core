import { Degrees, Kilometers, Radians, Seconds } from '../main';
import { Vector3D } from '../operations/Vector3D';
import { EpochUTC } from '../time/EpochUTC';
import { earthGravityParam, RAD2DEG, sec2min, secondsPerDay, TAU } from '../utils/constants';
import { clamp, matchHalfPlane, newtonNu } from '../utils/functions';
import { EquinoctialElements } from './EquinoctialElements';
import { OrbitRegime } from '../enums/OrbitRegime';
import { PositionVelocity, StateVector } from './StateVector';
import { ClassicalElementsParams } from '../interfaces/ClassicalElementsParams';

/**
 * The ClassicalElements class represents the classical orbital elements of an
 * object.
 *
 * @example
 * ```ts
 * const epoch = EpochUTC.fromDateTime(new Date('2024-01-14T14:39:39.914Z'));
 * const elements = new ClassicalElements({
 *  epoch,
 *  semimajorAxis: 6943.547853722985 as Kilometers,
 *  eccentricity: 0.0011235968124658146,
 *  inclination: 0.7509087232045765 as Radians,
 *  rightAscension: 0.028239555738616327 as Radians,
 *  argPerigee: 2.5386411901807353 as Radians,
 *  trueAnomaly: 0.5931399364974058 as Radians,
 * });
 * ```
 */
export class ClassicalElements {
  epoch: EpochUTC;
  semimajorAxis: Kilometers;
  eccentricity: number;
  inclination: Radians;
  rightAscension: Radians;
  argPerigee: Radians;
  trueAnomaly: Radians;
  /** Gravitational parameter in km³/s².  */
  mu: number;

  constructor({
    epoch,
    semimajorAxis,
    eccentricity,
    inclination,
    rightAscension,
    argPerigee,
    trueAnomaly,
    mu = earthGravityParam,
  }: ClassicalElementsParams) {
    this.epoch = epoch;
    this.semimajorAxis = semimajorAxis;
    this.eccentricity = eccentricity;
    this.inclination = inclination;
    this.rightAscension = rightAscension;
    this.argPerigee = argPerigee;
    this.trueAnomaly = trueAnomaly;
    this.mu = mu;
  }

  /**
   * Creates a new instance of ClassicalElements from a StateVector.
   * @param state The StateVector to convert. @param mu The gravitational
   * parameter of the central body. Default value is Earth's gravitational
   * parameter. @returns A new instance of ClassicalElements. @throws Error if
   * the StateVector is not in an inertial frame.
   */
  static fromStateVector(state: StateVector, mu = earthGravityParam): ClassicalElements {
    if (!state.inertial) {
      throw new Error('State vector must be in inertial frame (like J2000).');
    }
    const pos = state.position;
    const vel = state.velocity;
    const a = state.semimajorAxis();
    const eVecA = pos.scale(vel.magnitude() ** 2 - mu / pos.magnitude());
    const eVecB = vel.scale(pos.dot(vel));
    const eVec = eVecA.subtract(eVecB).scale(1 / mu);
    const e = eVec.magnitude();
    const h = pos.cross(vel);
    const i = Math.acos(clamp(h.z / h.magnitude(), -1.0, 1.0));
    const n = Vector3D.zAxis.cross(h);
    let o = Math.acos(clamp(n.x / n.magnitude(), -1.0, 1.0));

    if (n.y < 0) {
      o = TAU - o;
    }
    let w = n.angle(eVec);

    if (eVec.z < 0) {
      w = TAU - w;
    }
    let v = eVec.angle(pos);

    if (pos.dot(vel) < 0) {
      v = TAU - v;
    }

    return new ClassicalElements({
      epoch: state.epoch,
      semimajorAxis: a as Kilometers,
      eccentricity: e,
      inclination: i as Radians,
      rightAscension: o as Radians,
      argPerigee: w as Radians,
      trueAnomaly: v as Radians,
      mu,
    });
  }

  /**
   * Gets the inclination in degrees.
   * @returns The inclination in degrees.
   */
  get inclinationDegrees(): Degrees {
    return (this.inclination * RAD2DEG) as Degrees;
  }

  /**
   * Gets the right ascension in degrees.
   * @returns The right ascension in degrees.
   */
  get rightAscensionDegrees(): Degrees {
    return (this.rightAscension * RAD2DEG) as Degrees;
  }

  /**
   * Gets the argument of perigee in degrees.
   * @returns The argument of perigee in degrees.
   */
  get argPerigeeDegrees(): Degrees {
    return (this.argPerigee * RAD2DEG) as Degrees;
  }

  /**
   * Gets the true anomaly in degrees.
   * @returns The true anomaly in degrees.
   */
  get trueAnomalyDegrees(): Degrees {
    return (this.trueAnomaly * RAD2DEG) as Degrees;
  }

  /**
   * Gets the apogee of the classical elements.
   * @returns The apogee in kilometers.
   */
  get apogee(): Kilometers {
    return (this.semimajorAxis * (1.0 + this.eccentricity)) as Kilometers;
  }

  /**
   * Gets the perigee of the classical elements. The perigee is the point in an
   * orbit that is closest to the focus (in this case, the Earth).
   * @returns The perigee distance in kilometers.
   */
  get perigee(): number {
    return (this.semimajorAxis * (1.0 - this.eccentricity)) as Kilometers;
  }

  toString(): string {
    return [
      '[ClassicalElements]',
      `  Epoch: ${this.epoch}`,
      `  Semimajor Axis (a):       ${this.semimajorAxis.toFixed(4)} km`,
      `  Eccentricity (e):         ${this.eccentricity.toFixed(7)}`,
      `  Inclination (i):          ${this.inclinationDegrees.toFixed(4)}°`,
      `  Right Ascension (Ω):      ${this.rightAscensionDegrees.toFixed(4)}°`,
      `  Argument of Perigee (ω):  ${this.argPerigeeDegrees.toFixed(4)}°`,
      `  True Anomaly (ν):         ${this.trueAnomalyDegrees.toFixed(4)}°`,
    ].join('\n');
  }

  /**
   * Calculates the mean motion of the celestial object.
   * @returns The mean motion in radians.
   */
  get meanMotion(): Radians {
    return Math.sqrt(this.mu / this.semimajorAxis ** 3) as Radians;
  }

  /**
   * Calculates the period of the orbit.
   * @returns The period in seconds.
   */
  get period(): Seconds {
    return (TAU * Math.sqrt(this.semimajorAxis ** 3 / this.mu)) as Seconds;
  }

  /**
   * Compute the number of revolutions completed per day for this orbit.
   * @returns The number of revolutions per day.
   */
  get revsPerDay(): number {
    return secondsPerDay / this.period;
  }

  /**
   * Returns the orbit regime based on the classical elements.
   * @returns The orbit regime.
   */
  getOrbitRegime(): OrbitRegime {
    const n = this.revsPerDay;
    const p = this.period * sec2min;

    if (n >= 0.99 && n <= 1.01 && this.eccentricity < 0.01) {
      return OrbitRegime.GEO;
    }
    if (p >= 600 && p <= 800 && this.eccentricity <= 0.25) {
      return OrbitRegime.MEO;
    }
    if (n >= 11.25 && this.eccentricity <= 0.25) {
      return OrbitRegime.LEO;
    }
    if (this.eccentricity > 0.25) {
      return OrbitRegime.HEO;
    }

    return OrbitRegime.OTHER;
  }

  /**
   * Converts the classical orbital elements to position and velocity vectors.
   * @returns An object containing the position and velocity vectors.
   */
  toPositionVelocity(): PositionVelocity {
    const rVec = new Vector3D(Math.cos(this.trueAnomaly), Math.sin(this.trueAnomaly), 0.0);
    const rPQW = rVec.scale(
      (this.semimajorAxis * (1.0 - this.eccentricity ** 2)) / (1.0 + this.eccentricity * Math.cos(this.trueAnomaly)),
    );
    const vVec = new Vector3D(-Math.sin(this.trueAnomaly), this.eccentricity + Math.cos(this.trueAnomaly), 0.0);
    const vPQW = vVec.scale(Math.sqrt(this.mu / (this.semimajorAxis * (1 - this.eccentricity ** 2))));
    const position = rPQW.rotZ(-this.argPerigee).rotX(-this.inclination).rotZ(-this.rightAscension);
    const velocity = vPQW.rotZ(-this.argPerigee).rotX(-this.inclination).rotZ(-this.rightAscension);

    return { position, velocity };
  }

  /**
   * Converts the classical elements to equinoctial elements.
   * @returns {EquinoctialElements} The equinoctial elements.
   */
  toEquinoctialElements(): EquinoctialElements {
    const I = this.inclination > Math.PI / 2 ? -1 : 1;
    const h = this.eccentricity * Math.sin(this.argPerigee + I * this.rightAscension);
    const k = this.eccentricity * Math.cos(this.argPerigee + I * this.rightAscension);
    const meanAnomaly = newtonNu(this.eccentricity, this.trueAnomaly).m;
    const lambda = (meanAnomaly + this.argPerigee + I * this.rightAscension) as Radians;
    const a = this.semimajorAxis;
    const p = Math.tan(0.5 * this.inclination) ** I * Math.sin(this.rightAscension);
    const q = Math.tan(0.5 * this.inclination) ** I * Math.cos(this.rightAscension);

    return new EquinoctialElements({ epoch: this.epoch, k, h, lambda, a, p, q, mu: this.mu, I });
  }

  /**
   * Propagates the classical elements to a given epoch.
   *
   * @param propEpoch - The epoch to propagate the classical elements to.
   * @returns The classical elements at the propagated epoch.
   */
  propagate(propEpoch: EpochUTC): ClassicalElements {
    const t = this.epoch;
    const n = this.meanMotion;
    const delta = propEpoch.difference(t);
    const cosV = Math.cos(this.trueAnomaly);
    let eaInit = Math.acos(clamp((this.eccentricity + cosV) / (1 + this.eccentricity * cosV), -1, 1));

    eaInit = matchHalfPlane(eaInit, this.trueAnomaly);
    let maInit = eaInit - this.eccentricity * Math.sin(eaInit);

    maInit = matchHalfPlane(maInit, eaInit);
    const maFinal = (maInit + n * delta) % TAU;
    let eaFinal = maFinal;

    for (let iter = 0; iter < 32; iter++) {
      const eaTemp = maFinal + this.eccentricity * Math.sin(eaFinal);

      if (Math.abs(eaTemp - eaFinal) < 1e-12) {
        break;
      }
      eaFinal = eaTemp;
    }
    const cosEaFinal = Math.cos(eaFinal);
    let vFinal = clamp(Math.acos((cosEaFinal - this.eccentricity) / (1 - this.eccentricity * cosEaFinal)), -1, 1);

    vFinal = matchHalfPlane(vFinal, eaFinal);

    return new ClassicalElements({
      epoch: propEpoch,
      semimajorAxis: this.semimajorAxis,
      eccentricity: this.eccentricity,
      inclination: this.inclination,
      rightAscension: this.rightAscension,
      argPerigee: this.argPerigee,
      trueAnomaly: vFinal as Radians,
      mu: this.mu,
    });
  }
}
