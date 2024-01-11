/* eslint-disable require-jsdoc */
/* eslint-disable func-style */
import { AngularDiameterMethod } from '../enums/AngularDiameterMethod';
import { AngularDistanceMethod } from '../enums/AngularDistanceMethod';
import { Matrix } from '../operations/Matrix';
import { Vector } from '../operations/Vector';
import { DifferentiableFunction, EciVec3, JacobianFunction, Radians, SpaceObjectType, Vec3 } from '../types/types';

/**
 * Calculates the factorial of a given number.
 * @param n - The number to calculate the factorial for.
 * @returns The factorial of the given number.
 */
export function factorial(n: number): number {
  const nAbs = Math.abs(n);
  let result = 1;

  for (let i = 2; i <= nAbs; i++) {
    result *= i;
  }

  return result;
}

/**
 * Calculates the base 10 logarithm of a number.
 * @param x - The number to calculate the logarithm for.
 * @returns The base 10 logarithm of the input number.
 */
export function log10(x: number): number {
  return Math.log(x) / Math.LN10;
}

/**
 * Calculates the cube root of a number.
 *
 * @param n - The number to calculate the cube root of.
 * @returns The cube root of the given number.
 */
export function cbrt(n: number): number {
  return n ** (1 / 3);
}

/**
 * Calculates the hyperbolic sine of a number.
 * @param x - The number to calculate the hyperbolic sine of.
 * @returns The hyperbolic sine of the given number.
 */
export function sinh(x: number): number {
  return 0.5 * (Math.exp(x) - Math.exp(-x));
}

/**
 * Calculates the hyperbolic cosine of a number.
 *
 * @param x - The number for which to calculate the hyperbolic cosine.
 * @returns The hyperbolic cosine of the given number.
 */
export function cosh(x: number): number {
  return 0.5 * (Math.exp(x) + Math.exp(-x));
}

/**
 * Calculates the hyperbolic tangent of a number.
 *
 * @param x - The number to calculate the hyperbolic tangent of.
 * @returns The hyperbolic tangent of the given number.
 */
export function tanh(x: number): number {
  return sinh(x) / cosh(x);
}

/**
 * Calculates the hyperbolic cotangent of a number.
 *
 * @param x - The number for which to calculate the hyperbolic cotangent.
 * @returns The hyperbolic cotangent of the given number.
 */
export function coth(x: number): number {
  return cosh(x) / sinh(x);
}

/**
 * Calculates the hyperbolic secant of a number.
 *
 * @param x - The number to calculate the hyperbolic secant of.
 * @returns The hyperbolic secant of the given number.
 */
export function sech(x: number): number {
  return 1 / cosh(x);
}

/**
 * Calculates the hyperbolic cosecant of a number.
 *
 * @param x - The number for which to calculate the hyperbolic cosecant.
 * @returns The hyperbolic cosecant of the given number.
 */
export function csch(x: number): number {
  return 1 / sinh(x);
}

/**
 * Calculates the inverse hyperbolic sine of a number.
 *
 * @param x - The number to calculate the inverse hyperbolic sine of.
 * @returns The inverse hyperbolic sine of the given number.
 */
export function asinh(x: number): number {
  return Math.log(x + Math.sqrt(x * x + 1));
}

/**
 * Calculates the inverse hyperbolic cosine (acosh) of a number.
 *
 * @param x - The number to calculate the acosh for.
 * @returns The acosh value of the given number.
 */
export function acosh(x: number): number {
  return Math.log(x + Math.sqrt(x * x - 1));
}

/**
 * Calculates the inverse hyperbolic tangent of a number.
 *
 * @param x - The number to calculate the inverse hyperbolic tangent of.
 * @returns The inverse hyperbolic tangent of the given number.
 */
export function atanh(x: number): number {
  return 0.5 * Math.log((1 + x) / (1 - x));
}

/**
 * Returns the inverse hyperbolic cosecant of a number.
 *
 * @param x - The number to calculate the inverse hyperbolic cosecant of.
 * @returns The inverse hyperbolic cosecant of the given number.
 */
export function acsch(x: number): number {
  return Math.log(1 / x + Math.sqrt(1 / (x * x) + 1));
}

/**
 * Calculates the inverse hyperbolic secant (asech) of a number.
 *
 * @param x - The number to calculate the inverse hyperbolic secant of.
 * @returns The inverse hyperbolic secant of the given number.
 */
export function asech(x: number): number {
  return Math.log(1 / x + Math.sqrt(1 / (x * x) - 1));
}

/**
 * Calculates the inverse hyperbolic cotangent (acoth) of a number.
 *
 * @param x - The number to calculate the acoth of.
 * @returns The inverse hyperbolic cotangent of the given number.
 */
export function acoth(x: number): number {
  return 0.5 * Math.log((x + 1) / (x - 1));
}

/**
 * Copies the sign of the second number to the first number.
 * @param mag - The magnitude of the number.
 * @param sgn - The sign of the number.
 * @returns The number with the magnitude of `mag` and the sign of `sgn`.
 */
export function copySign(mag: number, sgn: number): number {
  return Math.abs(mag) * Math.sign(sgn);
}

/**
 * Evaluates a polynomial function at a given value.
 *
 * @param x - The value at which to evaluate the polynomial.
 * @param coeffs - The coefficients of the polynomial.
 * @returns The result of evaluating the polynomial at the given value.
 */
export function evalPoly(x: number, coeffs: Float64Array): number {
  let result = coeffs[0];

  for (let i = 1; i < coeffs.length; i++) {
    result = result * x + coeffs[i];
  }

  return result;
}

/**
 * Concatenates two Float64Arrays into a new Float64Array.
 *
 * @param a - The first Float64Array.
 * @param b - The second Float64Array.
 * @returns A new Float64Array containing the concatenated values of `a` and `b`.
 */
export function concat(a: Float64Array, b: Float64Array): Float64Array {
  const result = new Float64Array(a.length + b.length);

  result.set(a);
  result.set(b, a.length);

  return result;
}

/**
 * Calculates the angle in the half-plane that best matches the given angle.
 * @param angle - The angle to be matched.
 * @param match - The angle to be matched against.
 * @returns The angle in the half-plane that best matches the given angle.
 */
export function matchHalfPlane(angle: number, match: number): number {
  const a1 = angle;
  const a2 = 2 * Math.PI - angle;
  const d1 = Math.atan2(Math.sin(a1 - match), Math.cos(a1 - match));
  const d2 = Math.atan2(Math.sin(a2 - match), Math.cos(a2 - match));

  return Math.abs(d1) < Math.abs(d2) ? a1 : a2;
}

/**
 * Wraps an angle to the range [-π, π].
 * @param theta - The angle to wrap.
 * @returns The wrapped angle.
 */
export function wrapAngle(theta: number): number {
  const result = ((theta + Math.PI) % (2 * Math.PI)) - Math.PI;

  if (result === -Math.PI) {
    return Math.PI;
  }

  return result;
}

/**
 * Calculates the angular distance between two points on a sphere using the cosine formula.
 *
 * @param lam1 - The longitude of the first point in radians.
 * @param phi1 - The latitude of the first point in radians.
 * @param lam2 - The longitude of the second point in radians.
 * @param phi2 - The latitude of the second point in radians.
 * @returns The angular distance between the two points in radians.
 */
function angularDistanceCosine_(lam1: number, phi1: number, lam2: number, phi2: number): number {
  const a = Math.sin(phi1) * Math.sin(phi2);
  const b = Math.cos(phi1) * Math.cos(phi2) * Math.cos(lam2 - lam1);

  return Math.acos(a + b);
}

/**
 * Calculates the angular distance between two points on a sphere using the Haversine formula.
 *
 * @param lam1 - The longitude of the first point in radians.
 * @param phi1 - The latitude of the first point in radians.
 * @param lam2 - The longitude of the second point in radians.
 * @param phi2 - The latitude of the second point in radians.
 * @returns The angular distance between the two points in radians.
 */
function angularDistanceHaversine_(lam1: number, phi1: number, lam2: number, phi2: number): number {
  const dlam = lam2 - lam1;
  const dphi = phi2 - phi1;
  const sdlam = Math.sin(0.5 * dlam);
  const sdphi = Math.sin(0.5 * dphi);
  const a = sdphi * sdphi + Math.cos(phi1) * Math.cos(phi2) * sdlam * sdlam;

  return 2.0 * Math.asin(Math.min(1.0, Math.sqrt(a)));
}

/**
 * Calculates the angular distance between two points on a sphere.
 *
 * @param lam1 The longitude of the first point.
 * @param phi1 The latitude of the first point.
 * @param lam2 The longitude of the second point.
 * @param phi2 The latitude of the second point.
 * @param method The method to use for calculating the angular distance. Defaults to AngularDistanceMethod.Cosine.
 * @returns The angular distance between the two points.
 * @throws Error if an invalid angular distance method is provided.
 */
export function angularDistance(
  lam1: number,
  phi1: number,
  lam2: number,
  phi2: number,
  method: AngularDistanceMethod = AngularDistanceMethod.Cosine,
): number {
  switch (method) {
    case AngularDistanceMethod.Cosine:
      return angularDistanceCosine_(lam1, phi1, lam2, phi2);
    case AngularDistanceMethod.Haversine:
      return angularDistanceHaversine_(lam1, phi1, lam2, phi2);
    default:
      throw new Error('Invalid angular distance method.');
  }
}

/**
 * Calculates the linear distance between two points in three-dimensional space.
 * @param pos1 The first position.
 * @param pos2 The second position.
 * @returns The linear distance between the two positions in kilometers.
 */
export function linearDistance<D extends number>(pos1: Vec3<D>, pos2: Vec3<D>): D {
  return <D>Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2);
}

/**
 * Calculates the angular diameter of an object.
 *
 * @param diameter - The diameter of the object.
 * @param distance - The distance to the object.
 * @param method - The method used to calculate the angular diameter. Defaults to AngularDiameterMethod.Sphere.
 * @returns The angular diameter of the object.
 * @throws Error if an invalid angular diameter method is provided.
 */
export function angularDiameter(
  diameter: number,
  distance: number,
  method: AngularDiameterMethod = AngularDiameterMethod.Sphere,
): number {
  switch (method) {
    case AngularDiameterMethod.Circle:
      return 2 * Math.atan(diameter / (2 * distance));
    case AngularDiameterMethod.Sphere:
      return 2 * Math.asin(diameter / (2 * distance));
    default:
      throw new Error('Invalid angular diameter method.');
  }
}

/**
 * Performs linear interpolation between two points.
 * @param x - The x-coordinate to interpolate.
 * @param x0 - The x-coordinate of the first point.
 * @param y0 - The y-coordinate of the first point.
 * @param x1 - The x-coordinate of the second point.
 * @param y1 - The y-coordinate of the second point.
 * @returns The interpolated y-coordinate corresponding to the given x-coordinate.
 */
export function linearInterpolate(x: number, x0: number, y0: number, x1: number, y1: number): number {
  return (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0);
}

/**
 * Calculates the mean value of an array of numbers.
 *
 * @param values - The array of numbers.
 * @returns The mean value of the numbers.
 */
export function mean(values: number[]): number {
  const n = values.length;
  let sum = 0.0;

  for (const v of values) {
    sum += v;
  }

  return sum / n;
}

/**
 * Calculates the standard deviation of an array of numbers.
 *
 * @param values - The array of numbers.
 * @param isSample - Optional. Specifies whether the array represents a sample. Default is false.
 * @returns The standard deviation of the array.
 */
export function std(values: number[], isSample = false): number {
  const mu = mean(values);
  const n = values.length;
  let sum = 0.0;

  for (const v of values) {
    const sub = v - mu;

    sum += sub * sub;
  }
  const m = isSample ? 1 : 0;

  return Math.sqrt((1.0 / (n - m)) * sum);
}

/**
 * Calculates the covariance between two arrays.
 *
 * @param a - The first array.
 * @param b - The second array.
 * @param isSample - Optional. Specifies whether the arrays represent a sample. Default is false.
 * @returns The covariance between the two arrays.
 */
export function covariance(a: number[], b: number[], isSample = false): number {
  const n = a.length;
  const am = mean(a);
  const bm = mean(b);
  let result = 0.0;

  for (let i = 0; i < n; i++) {
    result += (a[i] - am) * (b[i] - bm);
  }
  const m = isSample ? 1 : 0;

  return result / (n - m);
}

/**
 * Calculates the derivative of a differentiable function.
 * @param f The differentiable function.
 * @param h The step size for numerical differentiation. Default value is 1e-3.
 * @returns The derivative function.
 */
export function derivative(f: DifferentiableFunction, h = 1e-3): DifferentiableFunction {
  function df(x: number): number {
    const hh = h * 0.5;

    return (f(x + hh) - f(x - hh)) / h;
  }

  return df;
}

/**
 * Calculates the gamma function of a number.
 * @param n - The input number.
 * @returns The gamma function value.
 */
export function gamma(n: number): number {
  return factorial(n - 1);
}

/**
 * Calculates the eccentric anomaly (e0) and true anomaly (nu) using Newton's method
 * for a given eccentricity (ecc) and mean anomaly (m).
 *
 * @param ecc - The eccentricity of the orbit.
 * @param m - The mean anomaly.
 * @returns An object containing the eccentric anomaly (e0) and true anomaly (nu).
 */
export function newtonM(ecc: number, m: number): { e0: number; nu: number } {
  const numiter = 50;
  const small = 1e-8;
  let e0;
  let nu;

  if (ecc > small) {
    if ((m < 0.0 && m > -Math.PI) || m > Math.PI) {
      e0 = m - ecc;
    } else {
      e0 = m + ecc;
    }
    let ktr = 1;
    let e1 = e0 + (m - e0 + ecc * Math.sin(e0)) / (1.0 - ecc * Math.cos(e0));

    while (Math.abs(e1 - e0) > small && ktr <= numiter) {
      ktr++;
      e0 = e1;
      e1 = e0 + (m - e0 + ecc * Math.sin(e0)) / (1.0 - ecc * Math.cos(e0));
    }
    const sinv = (Math.sqrt(1.0 - ecc * ecc) * Math.sin(e1)) / (1.0 - ecc * Math.cos(e1));
    const cosv = (Math.cos(e1) - ecc) / (1.0 - ecc * Math.cos(e1));

    nu = Math.atan2(sinv, cosv);
  } else {
    nu = m;
    e0 = m;
  }

  return { e0, nu };
}

/**
 * Calculates the eccentric anomaly (e0) and mean anomaly (m) using Newton's method
 * for a given eccentricity (ecc) and true anomaly (nu).
 *
 * @param ecc - The eccentricity of the orbit.
 * @param nu - The true anomaly.
 * @returns An object containing the calculated eccentric anomaly (e0) and mean anomaly (m).
 */
export function newtonNu(ecc: number, nu: number): { e0: number; m: Radians } {
  const small = 1e-8;
  let e0 = 0.0;
  let m = 0.0;

  if (Math.abs(ecc) < small) {
    m = nu;
    e0 = nu;
  } else if (ecc < 1.0 - small) {
    const sine = (Math.sqrt(1.0 - ecc * ecc) * Math.sin(nu)) / (1.0 + ecc * Math.cos(nu));
    const cose = (ecc + Math.cos(nu)) / (1.0 + ecc * Math.cos(nu));

    e0 = Math.atan2(sine, cose);
    m = e0 - ecc * Math.sin(e0);
  }
  if (ecc < 1.0) {
    m -= Math.floor(m / (2 * Math.PI)) * (2 * Math.PI);
    if (m < 0.0) {
      m += 2.0 * Math.PI;
    }
    e0 -= Math.floor(e0 / (2 * Math.PI)) * (2 * Math.PI);
  }

  return { e0, m: m as Radians };
}

/**
 * Creates a 2D array with the specified number of rows and columns, filled with the same given value.
 *
 * @template T The type of elements in the array.
 * @param {number} rows The number of rows in the 2D array.
 * @param {number} columns The number of columns in the 2D array.
 * @param {T} value The value to fill the array with.
 * @returns {T[][]} The 2D array with the specified number of rows and columns, filled with the given value.
 */
export function array2d<T>(rows: number, columns: number, value: T): T[][] {
  const output: T[][] = [];

  for (let i = 0; i < rows; i++) {
    output.push(Array(columns).fill(value));
  }

  return output;
}

/**
 * Calculates the Jacobian matrix of a given Jacobian function.
 *
 * @param f The Jacobian function.
 * @param m The number of rows in the Jacobian matrix.
 * @param x0 The initial values of the variables.
 * @param step The step size for numerical differentiation (default: 1e-5).
 * @returns The Jacobian matrix.
 */
export function jacobian(f: JacobianFunction, m: number, x0: Float64Array, step = 1e-5): Matrix {
  const n = x0.length;
  const j = array2d(m, n, 0.0);
  const h = 0.5 * step;

  for (let k = 0; k < n; k++) {
    const xp = x0.slice();

    xp[k] += h;
    const fp = new Vector(f(xp));

    const xm = x0.slice();

    xm[k] -= h;
    const fm = new Vector(f(xm));

    const cd = fp.subtract(fm).scale(1.0 / step);

    for (let i = 0; i < m; i++) {
      j[i][k] = cd[i];
    }
  }

  return new Matrix(j);
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param x The number to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The clamped number.
 */
export function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(x, max));
}

/**
 * Determines whether a given year is a leap year.
 * @param dateIn The date to check.
 * @returns `true` if the year is a leap year, `false` otherwise.
 */
export function isLeapYear(dateIn: Date): boolean {
  const year = dateIn.getUTCFullYear();

  if ((year & 3) !== 0) {
    return false;
  }

  return year % 100 !== 0 || year % 400 === 0;
}

/**
 * Calculates the day of the year for a given date.
 * If no date is provided, the current date is used.
 *
 * This is sometimes referred to as the Jday, but is
 * very different from the Julian day used in astronomy.
 *
 * @param date - The date for which to calculate the day of the year.
 * @returns The day of the year as a number.
 */
export function getDayOfYear(date = new Date()): number {
  const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const mn = date.getMonth();
  const dn = date.getUTCDate();
  let dayOfYear = dayCount[mn] + dn;

  if (mn > 1 && isLeapYear(date)) {
    dayOfYear++;
  }

  return dayOfYear;
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param value - The number to round.
 * @param places - The number of decimal places to round to.
 * @returns The rounded number.
 */
export function toPrecision(value: number, places: number): number {
  return Number(value.toFixed(places));
}

/**
 * Returns the sign of a number.
 * @param value - The number to determine the sign of.
 * @returns 1 if the number is positive, -1 if the number is negative.
 */
export function sign(value: number) {
  return value >= 0 ? 1 : -1;
}

const spaceObjTypeStrMap = {
  [SpaceObjectType.UNKNOWN]: 'Unknown',
  [SpaceObjectType.PAYLOAD]: 'Payload',
  [SpaceObjectType.ROCKET_BODY]: 'Rocket Body',
  [SpaceObjectType.DEBRIS]: 'Debris',
  [SpaceObjectType.SPECIAL]: 'Special',
  [SpaceObjectType.BALLISTIC_MISSILE]: 'Ballistic Missile',
  [SpaceObjectType.STAR]: 'Star',
  [SpaceObjectType.INTERGOVERNMENTAL_ORGANIZATION]: 'Intergovernmental Organization',
  [SpaceObjectType.SUBORBITAL_PAYLOAD_OPERATOR]: 'Suborbital Payload Operator',
  [SpaceObjectType.PAYLOAD_OWNER]: 'Payload Owner',
  [SpaceObjectType.METEOROLOGICAL_ROCKET_LAUNCH_AGENCY_OR_MANUFACTURER]:
    'Meteorological Rocket Launch Agency or Manufacturer',
  [SpaceObjectType.PAYLOAD_MANUFACTURER]: 'Payload Manufacturer',
  [SpaceObjectType.LAUNCH_AGENCY]: 'Launch Agency',
  [SpaceObjectType.LAUNCH_SITE]: 'Launch Site',
  [SpaceObjectType.LAUNCH_POSITION]: 'Launch Position',
  [SpaceObjectType.LAUNCH_FACILITY]: 'Launch Facility',
  [SpaceObjectType.CONTROL_FACILITY]: 'Control Facility',
  [SpaceObjectType.GROUND_SENSOR_STATION]: 'Ground Sensor Station',
  [SpaceObjectType.OPTICAL]: 'Optical',
  [SpaceObjectType.MECHANICAL]: 'Mechanical',
  [SpaceObjectType.PHASED_ARRAY_RADAR]: 'Phased Array Radar',
  [SpaceObjectType.OBSERVER]: 'Observer',
  [SpaceObjectType.BISTATIC_RADIO_TELESCOPE]: 'Bi-static Radio Telescope',
  [SpaceObjectType.COUNTRY]: 'Country',
  [SpaceObjectType.LAUNCH_VEHICLE_MANUFACTURER]: 'Launch Vehicle Manufacturer',
  [SpaceObjectType.ENGINE_MANUFACTURER]: 'Engine Manufacturer',
  [SpaceObjectType.NOTIONAL]: 'Notional',
  [SpaceObjectType.FRAGMENT]: 'Fragment',
};

export const spaceObjType2Str = (spaceObjType: SpaceObjectType): string =>
  spaceObjTypeStrMap[spaceObjType] || 'Unknown';

export const dopplerFactor = (location: EciVec3, position: EciVec3, velocity: EciVec3): number => {
  const mfactor = 7.292115e-5;
  const c = 299792.458; // Speed of light in km/s

  const range = <EciVec3>{
    x: position.x - location.x,
    y: position.y - location.y,
    z: position.z - location.z,
  };
  const distance = Math.sqrt(range.x ** 2 + range.y ** 2 + range.z ** 2);

  const rangeVel = <EciVec3>{
    x: velocity.x + mfactor * location.y,
    y: velocity.y - mfactor * location.x,
    z: velocity.z,
  };

  const rangeRate = (range.x * rangeVel.x + range.y * rangeVel.y + range.z * rangeVel.z) / distance;
  let dopplerFactor = 0;

  if (rangeRate < 0) {
    dopplerFactor = 1 + (rangeRate / c) * sign(rangeRate);
  }

  if (rangeRate >= 0) {
    dopplerFactor = 1 - (rangeRate / c) * sign(rangeRate);
  }

  return dopplerFactor;
};
