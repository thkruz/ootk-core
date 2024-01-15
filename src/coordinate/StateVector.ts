import { Kilometers, Minutes } from 'src/main';
import { Earth } from '../body/Earth';
import type { Vector3D } from '../operations/Vector3D';
import type { EpochUTC } from '../time/EpochUTC';
import { TAU } from '../utils/constants';
import { ClassicalElements } from './ClassicalElements';

/**
 * A state vector is a set of coordinates used to specify the position and
 * velocity of an object in a particular reference frame.
 */
export abstract class StateVector {
  epoch: EpochUTC;
  position: Vector3D<Kilometers>;
  velocity: Vector3D<Kilometers>;
  constructor(epoch: EpochUTC, position: Vector3D<Kilometers>, velocity: Vector3D<Kilometers>) {
    this.epoch = epoch;
    this.position = position;
    this.velocity = velocity;
  }

  /**
   * The name of the reference frame in which the state vector is defined.
   */
  abstract get name(): string;

  /**
   * Whether the state vector is defined in an inertial reference frame.
   */
  abstract get inertial(): boolean;

  /**
   * Returns a string representation of the StateVector object. The string
   * includes the name, epoch, position, and velocity.
   * @returns A string representation of the StateVector object.
   */
  toString(): string {
    return [
      `[${this.name}]`,
      `  Epoch: ${this.epoch}`,
      `  Position: ${this.position.toString(6)} km`,
      `  Velocity: ${this.velocity.toString(9)} km/s`,
    ].join('\n');
  }

  /**
   * Calculates the mechanical energy of the state vector.
   *
   * @returns The mechanical energy value.
   */
  get mechanicalEnergy(): number {
    const r = this.position.magnitude();
    const v = this.velocity.magnitude();

    return v * v * 0.5 - Earth.mu / r;
  }

  /**
   * Calculates the semimajor axis of the state vector.
   *
   * @returns The semimajor axis in kilometers.
   */
  get semimajorAxis(): Kilometers {
    const energy = this.mechanicalEnergy;

    return (-Earth.mu / (2.0 * energy)) as Kilometers;
  }

  /**
   * Gets the period of the state vector in minutes.
   *
   * @returns The period in minutes.
   */
  get period(): Minutes {
    const a = this.semimajorAxis;
    const periodSeconds = TAU * Math.sqrt((a * a * a) / Earth.mu);

    return (periodSeconds / 60.0) as Minutes;
  }

  /**
   * Gets the angular rate of the state vector.
   *
   * @returns The angular rate.
   */
  get angularRate(): number {
    const a = this.semimajorAxis;

    return Math.sqrt(Earth.mu / (a * a * a));
  }

  /**
   * Converts the state vector to classical elements.
   * @param mu The gravitational parameter of the celestial body. Defaults to
   * Earth's gravitational parameter. @returns The classical elements
   * corresponding to the state vector. @throws Error if classical elements are
   * undefined for fixed frames.
   */
  toClassicalElements({ mu = Earth.mu }: { mu?: number } = {}): ClassicalElements {
    if (!this.inertial) {
      throw new Error('Classical elements are undefined for fixed frames.');
    }

    return ClassicalElements.fromStateVector(this, mu);
  }
}
