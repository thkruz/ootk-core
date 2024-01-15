/* eslint-disable class-methods-use-this */
import { Kilometers, Radians, Vector3D } from '../main';
import { Earth } from '../body/Earth';
import type { ClassicalElements } from './ClassicalElements';
import { J2000 } from './J2000';
import { StateVector } from './StateVector';

/**
 * True Equator Mean Equinox (TEME) is a coordinate system commonly used in
 * satellite tracking and orbit prediction. It is a reference frame that defines
 * the position and orientation of an object relative to the Earth's equator and
 * equinox.
 *
 * By using the True Equator Mean Equinox (TEME) coordinate system, we can
 * accurately describe the position and motion of satellites relative to the
 * Earth's equator and equinox. This is particularly useful for tracking and
 * predicting satellite orbits in various applications, such as satellite
 * communication, navigation, and remote sensing.
 */
export class TEME extends StateVector {
  /**
   * Gets the name of the coordinate system.
   * @returns The name of the coordinate system.
   */
  get name(): string {
    return 'TEME';
  }

  /**
   * Gets a value indicating whether the coordinate is inertial.
   * @returns A boolean value indicating whether the coordinate is inertial.
   */
  get inertial(): boolean {
    return true;
  }

  /**
   * Creates a TEME (True Equator Mean Equinox) object from classical orbital
   * elements.
   *
   * @param elements - The classical orbital elements.
   * @returns A new TEME object.
   */
  static fromClassicalElements(elements: ClassicalElements): TEME {
    const rv = elements.toPositionVelocity();

    return new TEME(elements.epoch, rv.position, rv.velocity);
  }

  /**
   * Converts the TEME (True Equator Mean Equinox) coordinates to J2000
   * coordinates.
   * @returns The J2000 coordinates.
   */
  toJ2000(): J2000 {
    const p = Earth.precession(this.epoch);
    const n = Earth.nutation(this.epoch);
    const eps = n.mEps + n.dEps;
    const dPsiCosEps = n.dPsi * Math.cos(eps);
    const rMOD = this.position
      .rotZ(-dPsiCosEps as Radians)
      .rotX(eps)
      .rotZ(n.dPsi)
      .rotX(-n.mEps);
    const vMOD = this.velocity
      .rotZ(-dPsiCosEps as Radians)
      .rotX(eps)
      .rotZ(n.dPsi)
      .rotX(-n.mEps);
    const rJ2K = rMOD
      .rotZ(p.zed)
      .rotY(-p.theta as Radians)
      .rotZ(p.zeta) as Vector3D<Kilometers>;
    const vJ2K = vMOD
      .rotZ(p.zed)
      .rotY(-p.theta as Radians)
      .rotZ(p.zeta) as Vector3D<Kilometers>;

    return new J2000(this.epoch, rJ2K, vJ2K);
  }
}
