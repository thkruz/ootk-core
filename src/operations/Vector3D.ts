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

import { Kilometers, Radians, linearDistance } from '../main';
import { Matrix } from './Matrix';
import { Vector } from './Vector';

// / 3-dimensional vector.
export class Vector3D<T extends number = number> {
  constructor(
    public x: T,
    public y: T,
    public z: T,
  ) {
    // Nothing to do here.
  }

  /**
   * Create a new Vector3D object from the first three elements of a Vector
   * object.
   * @param v The Vector object to convert.
   * @returns A new Vector3D object.
   */
  static fromVector<U extends number>(v: Vector<U>): Vector3D<U> {
    return new Vector3D<U>(v.x as U, v.y as U, v.z as U);
  }

  // / Origin vector.
  static origin = new Vector3D<number>(0, 0, 0);

  // / X-axis unit vector.
  static xAxis = new Vector3D<number>(1, 0, 0);

  // / Y-axis unit vector.
  static yAxis = new Vector3D<number>(0, 1, 0);

  // / Z-axis unit vector.
  static zAxis = new Vector3D<number>(0, 0, 1);

  // / Negative x-axis unit vector.
  static xAxisNeg = new Vector3D<number>(-1, 0, 0);

  // / Negative y-axis unit vector.
  static yAxisNeg = new Vector3D<number>(0, -1, 0);

  // / Negative z-axis unit vector.
  static zAxisNeg = new Vector3D<number>(0, 0, -1);

  // / Convert this to a [List] of doubles.
  toList() {
    return [this.x, this.y, this.z];
  }

  // / Convert this to a [Float64List] object.
  toArray() {
    return new Float64Array([this.x, this.y, this.z]);
  }

  /**
   * Return the Vector3D element at the provided index.
   * @deprecated don't do this
   * @param index The index of the element to return.
   * @returns The element at the provided index.
   */
  public getElement(index: number): number {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error(`Index ${index} outside 3D vector bounds.`);
    }
  }

  // / Convert this to a [Vector] object.
  toVector() {
    return new Vector(this.toList());
  }

  toString(fixed = -1): string {
    if (fixed < 0) {
      return `[${this.toList().join(', ')}]`;
    }
    const output = this.toList().map((e) => e.toFixed(fixed));

    return `[${output.join(', ')}]`;
  }

  // / Return the magnitude of this vector.
  magnitude(): T {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z) as T;
  }

  // / Return the result of adding this to another [Vector3D].
  add(v: Vector3D<T>): Vector3D<T> {
    return new Vector3D<T>((this.x + v.x) as T, (this.y + v.y) as T, (this.z + v.z) as T);
  }

  // / Return the result of subtracting this and another [Vector3D].
  subtract(v: Vector3D<T>): Vector3D<T> {
    return new Vector3D<T>((this.x - v.x) as T, (this.y - v.y) as T, (this.z - v.z) as T);
  }

  // / Return a copy of this [Vector3D] scaled by [n];
  scale(n: number): Vector3D {
    return new Vector3D(this.x * n, this.y * n, this.z * n);
  }

  // / Return a copy of this [Vector3D] with the elements negated.
  negate(): Vector3D<Kilometers> {
    return this.scale(-1) as Vector3D<Kilometers>;
  }

  /**
   * Return the Euclidean distance between this and another Vector3D.
   * @param v The other Vector3D.
   * @returns The distance between this and the other Vector3D.
   */
  distance(v: Vector3D): number {
    return linearDistance(this, v);
  }

  /**
   * Convert this to a unit Vector3D.
   * @returns A unit Vector3D.
   */
  normalize(): Vector3D {
    const m = this.magnitude();

    if (m === 0) {
      return Vector3D.origin;
    }

    return new Vector3D(this.x / m, this.y / m, this.z / m);
  }

  // Calculate the dot product of this and another [Vector3D].
  dot(v: Vector3D): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  // Calculate the outer product between this and another [Vector3D].
  outer(v: Vector3D): Matrix {
    return new Matrix([
      [this.x * v.x, this.x * v.y, this.x * v.z],
      [this.y * v.x, this.y * v.y, this.y * v.z],
      [this.z * v.x, this.z * v.y, this.z * v.z],
    ]);
  }

  // Calculate the cross product of this and another [Vector3D].
  cross(v: Vector3D<T>): Vector3D<T> {
    return new Vector3D<T>(
      (this.y * v.z - this.z * v.y) as T,
      (this.z * v.x - this.x * v.z) as T,
      (this.x * v.y - this.y * v.x) as T,
    );
  }

  // Calculate the skew-symmetric matrix for this [Vector3D].
  skewSymmetric(): Matrix {
    return new Matrix([
      [0, -this.z, this.y],
      [this.z, 0, -this.x],
      [-this.y, this.x, 0],
    ]);
  }

  /*
   * Create a copy of this [Vector3D] rotated in the x-axis by angle [theta]
   * _(rad)_.
   */
  rotX(theta: number): Vector3D {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    return new Vector3D(this.x, cosT * this.y + sinT * this.z, -sinT * this.y + cosT * this.z);
  }

  /*
   * Create a copy of this [Vector3D] rotated in the y-axis by angle [theta]
   * _(rad)_.
   */
  rotY(theta: Radians): Vector3D<T> {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    return new Vector3D<T>((cosT * this.x + -sinT * this.z) as T, this.y, (sinT * this.x + cosT * this.z) as T);
  }

  /*
   * Create a copy of this [Vector3D] rotated in the z-axis by angle [theta]
   * _(rad)_.
   */
  rotZ(theta: Radians): Vector3D<T> {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    return new Vector3D((cosT * this.x + sinT * this.y) as T, (-sinT * this.x + cosT * this.y) as T, this.z);
  }

  // Calculate the angle _(rad)_ between this and another [Vector3D].
  angle(v: Vector3D<T>): number {
    const theta = Math.atan2(this.cross(v).magnitude(), this.dot(v));

    return isNaN(theta) ? 0 : theta;
  }

  // Calculate the angle _(°)_ between this and another [Vector3D].
  angleDegrees(v: Vector3D<T>): number {
    return this.angle(v) * (180 / Math.PI);
  }

  /*
   * Return `true` if line-of-sight exists between this and another [Vector3D]
   * with a central body of the given [radius].
   */
  sight(v: Vector3D, radius: number): boolean {
    const r1Mag2 = this.magnitude() ** 2;
    const r2Mag2 = v.magnitude() ** 2;
    const rDot = this.dot(v);
    const tMin = (r1Mag2 - rDot) / (r1Mag2 + r2Mag2 - 2 * rDot);
    let los = false;

    if (tMin < 0 || tMin > 1) {
      los = true;
    } else {
      const c = (1 - tMin) * r1Mag2 + rDot * tMin;

      if (c >= radius * radius) {
        los = true;
      }
    }

    return los;
  }

  // / Return the unit vector that bisects this and another [Vector3D].
  bisect(v: Vector3D): Vector3D {
    return this.scale(v.magnitude()).add(v.scale(this.magnitude())).normalize();
  }

  // / Convert this [Vector3D] into a row [Matrix].
  row(): Matrix {
    return new Matrix([[this.x, this.y, this.z]]);
  }

  // / Convert this [Vector3D] into a column [Matrix].
  column(): Matrix {
    return new Matrix([[this.x], [this.y], [this.z]]);
  }

  // / Join this and another [Vector3D] into a new [Vector] object.
  join(v: Vector3D): Vector {
    const output = new Float64Array(6);

    output[0] = this.x;
    output[1] = this.y;
    output[2] = this.z;
    output[3] = v.x;
    output[4] = v.y;
    output[5] = v.z;

    return new Vector(output);
  }
}
