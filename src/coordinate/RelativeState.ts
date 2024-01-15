import { Kilometers } from 'src/main';
import { Matrix } from '../operations/Matrix';
import { Vector3D } from '../operations/Vector3D';
import { J2000 } from './J2000';

/**
 * Represents the relative state of an object in 3D space.
 */
export abstract class RelativeState {
  position: Vector3D<Kilometers>;
  velocity: Vector3D<Kilometers>;
  constructor(position: Vector3D<Kilometers>, velocity: Vector3D<Kilometers>) {
    this.position = position;
    this.velocity = velocity;
  }

  /**
   * Gets the name of the coordinate system.
   *
   * @returns The name of the coordinate system.
   */
  abstract get name(): string;

  /**
   * Returns a string representation of the RelativeState object. The string
   * includes the name, position, and velocity of the object.
   *
   * @returns A string representation of the RelativeState object.
   */
  toString(): string {
    return [
      `[${this.name}]`,
      `  Position: ${this.position.toString(6)} km`,
      `  Velocity: ${this.velocity.toString(9)} km/s`,
    ].join('\n');
  }

  /**
   * Transforms the current RelativeState coordinate to the J2000 coordinate
   * @param origin The origin J2000 coordinate.
   *
   * @returns The transformed J2000 coordinate.
   */
  abstract toJ2000(origin: J2000): J2000;

  /**
   * Creates a matrix based on the given position and velocity vectors. The
   * matrix represents the relative state of an object in 3D space.
   *
   * @param position - The position vector.
   *
   * @param velocity - The velocity vector.
   *
   * @returns The matrix representing the relative state.
   */
  static createMatrix(position: Vector3D, velocity: Vector3D): Matrix {
    const ru = position.normalize();
    const cu = position.cross(velocity).normalize();
    const iu = cu.cross(ru).normalize();

    return new Matrix([
      [ru.x, ru.y, ru.z],
      [iu.x, iu.y, iu.z],
      [cu.x, cu.y, cu.z],
    ]);
  }

  /**
   * Calculates the range of the relative state.
   * @returns The range in kilometers.
   */
  get range(): Kilometers {
    return this.position.magnitude();
  }

  /**
   * Calculates the range rate of the relative state. Range rate is the dot
   * product of the position and velocity divided by the range.
   *
   * @returns The range rate in Kilometers per second.
   */
  get rangeRate(): number {
    return this.position.dot(this.velocity) / this.range;
  }
}
